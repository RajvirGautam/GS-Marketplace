import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Product from '../models/Product.js';
import Deal from '../models/Deal.js';
import { authenticate } from '../middleware/auth.js';
import { io } from '../server.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Multer — memory storage for Cloudinary streaming
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Unsupported file type'), false);
    }
});

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = 'chat', resourceType = 'auto') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: resourceType, quality: 'auto', fetch_format: 'auto' },
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

// Helper: emit new_message to the recipient(s) in a conversation
const emitToRecipients = (conversation, senderId, message) => {
    conversation.participants.forEach(participantId => {
        if (participantId.toString() !== senderId.toString()) {
            io.to(`user:${participantId.toString()}`).emit('new_message', {
                conversationId: conversation._id.toString(),
                message
            });
        }
    });
};

// Helper: create Notification doc + emit real-time socket event
async function createAndEmitNotification(userId, type, title, body, meta = {}) {
    try {
        const notif = await Notification.create({ userId, type, title, body, meta });
        io.to(`user:${userId.toString()}`).emit('new_notification', notif);
    } catch (err) {
        console.error('[chat-notif] error:', err.message);
    }
}

// ─────────────────────────────────────────────
// GET /api/chat/unread-count
// Total unread message count for the current user
// ─────────────────────────────────────────────
router.get('/unread-count', authenticate, async (req, res) => {
    try {
        const count = await Message.countDocuments({
            readBy: { $ne: req.user._id },
            sender: { $ne: req.user._id },
            conversation: {
                $in: await Conversation.distinct('_id', { participants: req.user._id })
            }
        });
        res.json({ success: true, count });
    } catch (err) {
        console.error('Error fetching unread count:', err);
        res.status(500).json({ success: false, count: 0 });
    }
});

// ─────────────────────────────────────────────
// POST /api/chat/conversations
// Start or get an existing conversation for a product
// ─────────────────────────────────────────────
router.post('/conversations', authenticate, async (req, res) => {
    try {
        const { productId } = req.body;
        const buyerId = req.user._id;

        const product = await Product.findById(productId).select('seller title images');
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        const sellerId = product.seller;
        if (sellerId.toString() === buyerId.toString()) {
            return res.status(400).json({ success: false, message: 'Cannot start a conversation with yourself' });
        }

        const participants = [buyerId, sellerId].sort((a, b) => a.toString().localeCompare(b.toString()));

        let conversation = await Conversation.findOne({
            product: productId,
            participants: { $all: participants, $size: 2 }
        })
            .populate('participants', 'fullName profilePicture')
            .populate('product', 'title images price type condition category branch year description highlights specs barterFor createdAt')
            .populate({ path: 'lastMessage', select: 'content type createdAt sender readBy' });

        if (!conversation) {
            conversation = await Conversation.create({ participants, product: productId });
            conversation = await Conversation.findById(conversation._id)
                .populate('participants', 'fullName profilePicture')
                .populate('product', 'title images price type condition category branch year description highlights specs barterFor createdAt');
        }

        res.json({ success: true, conversation });
    } catch (err) {
        console.error('Error starting conversation:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

// ─────────────────────────────────────────────
// GET /api/chat/conversations
// List all conversations for the current user
// ─────────────────────────────────────────────
router.get('/conversations', authenticate, async (req, res) => {
    try {
        const conversations = await Conversation.find({ participants: req.user._id })
            .populate('participants', 'fullName profilePicture')
            .populate('product', 'title images price type condition category branch year description highlights specs barterFor createdAt')
            .populate({ path: 'lastMessage', select: 'content type createdAt sender readBy' })
            .sort({ lastMessageAt: -1 });

        // Compute unreadCount per conversation
        const withUnread = await Promise.all(conversations.map(async (conv) => {
            const unreadCount = await Message.countDocuments({
                conversation: conv._id,
                sender: { $ne: req.user._id },
                readBy: { $ne: req.user._id }
            });
            const obj = conv.toObject();
            obj.unreadCount = unreadCount;
            return obj;
        }));

        res.json({ success: true, conversations: withUnread });
    } catch (err) {
        console.error('Error listing conversations:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ─────────────────────────────────────────────
// GET /api/chat/conversations/:id/messages
// Paginated messages for a conversation
// ─────────────────────────────────────────────
router.get('/conversations/:id/messages', authenticate, async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

        const isParticipant = conversation.participants.some(p => p.toString() === req.user._id.toString());
        if (!isParticipant) return res.status(403).json({ success: false, message: 'Access denied' });

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;

        const messages = await Message.find({ conversation: req.params.id })
            .populate('sender', 'fullName profilePicture')
            .sort({ createdAt: 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Mark messages as read
        const updateResult = await Message.updateMany(
            { conversation: req.params.id, readBy: { $ne: req.user._id } },
            { $addToSet: { readBy: req.user._id } }
        );

        if (updateResult.modifiedCount > 0) {
            // Tell the sender that their messages were just read
            conversation.participants.forEach(participantId => {
                if (participantId.toString() !== req.user._id.toString()) {
                    io.to(`user:${participantId.toString()}`).emit('messages_read', {
                        conversationId: req.params.id,
                        readByUserId: req.user._id
                    });
                }
            });
        }

        res.json({ success: true, messages, page });
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ─────────────────────────────────────────────
// POST /api/chat/conversations/:id/messages
// Send a text message
// ─────────────────────────────────────────────
router.post('/conversations/:id/messages', authenticate, async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

        const isParticipant = conversation.participants.some(p => p.toString() === req.user._id.toString());
        if (!isParticipant) return res.status(403).json({ success: false, message: 'Access denied' });

        const { content } = req.body;
        if (!content?.trim()) return res.status(400).json({ success: false, message: 'Message content required' });

        const message = await Message.create({
            conversation: req.params.id,
            sender: req.user._id,
            type: 'text',
            content: content.trim(),
            readBy: [req.user._id]
        });

        await Conversation.findByIdAndUpdate(req.params.id, {
            lastMessage: message._id,
            lastMessageAt: new Date()
        });

        const populated = await Message.findById(message._id).populate('sender', 'fullName profilePicture');

        // 🔴 Real-time: notify recipient(s)
        emitToRecipients(conversation, req.user._id, populated);

        // 🔔 In-app notification for each recipient
        const senderName = populated.sender?.fullName || 'Someone';
        conversation.participants.forEach(participantId => {
            if (participantId.toString() !== req.user._id.toString()) {
                createAndEmitNotification(
                    participantId,
                    'new_message',
                    `New Message from ${senderName}`,
                    content.trim().slice(0, 80),
                    { conversationId: conversation._id }
                );
            }
        });

        res.status(201).json({ success: true, message: populated });
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ─────────────────────────────────────────────
// POST /api/chat/upload
// Upload a file to Cloudinary immediately and return the URL (no message created)
// ─────────────────────────────────────────────
router.post('/upload', authenticate, upload.single('media'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
        const isVideo = req.file.mimetype.startsWith('video/');
        const isImage = req.file.mimetype.startsWith('image/');
        const resourceType = isVideo ? 'video' : isImage ? 'image' : 'raw';
        const result = await uploadToCloudinary(req.file.buffer, 'chat', resourceType);
        const mediaType = isVideo ? 'video' : isImage ? 'image' : 'file';
        res.json({ success: true, url: result.secure_url, mediaType });
    } catch (err) {
        console.error('Error pre-uploading media:', err);
        res.status(500).json({ success: false, message: 'Upload failed', error: err.message });
    }
});

// POST /api/chat/conversations/:id/media-url
// Create a chat message from an already-uploaded Cloudinary URL (fast send path)
// ─────────────────────────────────────────────
router.post('/conversations/:id/media-url', authenticate, async (req, res) => {
    try {
        const { mediaUrl, mediaType, caption = '' } = req.body;
        if (!mediaUrl || !mediaType) return res.status(400).json({ success: false, message: 'mediaUrl and mediaType required' });

        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

        const isParticipant = conversation.participants.some(p => p.toString() === req.user._id.toString());
        if (!isParticipant) return res.status(403).json({ success: false, message: 'Access denied' });

        const message = await Message.create({
            conversation: req.params.id,
            sender: req.user._id,
            type: 'media',
            content: caption,
            mediaUrl,
            mediaType,
            readBy: [req.user._id]
        });

        await Conversation.findByIdAndUpdate(req.params.id, {
            lastMessage: message._id,
            lastMessageAt: new Date()
        });

        const populated = await Message.findById(message._id).populate('sender', 'fullName profilePicture');
        emitToRecipients(conversation, req.user._id, populated);

        const senderName = populated.sender?.fullName || 'Someone';
        conversation.participants.forEach(participantId => {
            if (participantId.toString() !== req.user._id.toString()) {
                createAndEmitNotification(
                    participantId,
                    'new_message',
                    `${senderName} sent ${mediaType === 'image' ? 'a photo' : mediaType === 'video' ? 'a video' : 'a file'}`,
                    '',
                    { conversationId: conversation._id }
                );
            }
        });

        res.status(201).json({ success: true, message: populated });
    } catch (err) {
        console.error('Error sending media message:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

// POST /api/chat/conversations/:id/media
// Upload media (image/video/file) and send as message
// ─────────────────────────────────────────────
router.post('/conversations/:id/media', authenticate, upload.single('media'), async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

        const isParticipant = conversation.participants.some(p => p.toString() === req.user._id.toString());
        if (!isParticipant) return res.status(403).json({ success: false, message: 'Access denied' });

        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        const isVideo = req.file.mimetype.startsWith('video/');
        const isImage = req.file.mimetype.startsWith('image/');
        const resourceType = isVideo ? 'video' : isImage ? 'image' : 'raw';

        const result = await uploadToCloudinary(req.file.buffer, 'chat', resourceType);

        const mediaType = isVideo ? 'video' : isImage ? 'image' : 'file';
        const message = await Message.create({
            conversation: req.params.id,
            sender: req.user._id,
            type: 'media',
            content: req.body.caption || '',
            mediaUrl: result.secure_url,
            mediaType,
            readBy: [req.user._id]
        });

        await Conversation.findByIdAndUpdate(req.params.id, {
            lastMessage: message._id,
            lastMessageAt: new Date()
        });

        const populated = await Message.findById(message._id).populate('sender', 'fullName profilePicture');

        // 🔴 Real-time: notify recipient(s)
        emitToRecipients(conversation, req.user._id, populated);

        // 🔔 In-app notification
        const senderName = populated.sender?.fullName || 'Someone';
        conversation.participants.forEach(participantId => {
            if (participantId.toString() !== req.user._id.toString()) {
                createAndEmitNotification(
                    participantId,
                    'new_message',
                    `${senderName} sent ${mediaType === 'image' ? 'a photo 📷' : mediaType === 'video' ? 'a video 🎥' : 'a file 📎'}`,
                    '',
                    { conversationId: conversation._id }
                );
            }
        });

        res.status(201).json({ success: true, message: populated });
    } catch (err) {
        console.error('Error uploading media:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

// ─────────────────────────────────────────────
// POST /api/chat/conversations/:id/offer
// Send a price negotiation offer card
// ─────────────────────────────────────────────
router.post('/conversations/:id/offer', authenticate, async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

        const isParticipant = conversation.participants.some(p => p.toString() === req.user._id.toString());
        if (!isParticipant) return res.status(403).json({ success: false, message: 'Access denied' });

        const { amount, note } = req.body;
        if (!amount || isNaN(Number(amount))) {
            return res.status(400).json({ success: false, message: 'Valid offer amount required' });
        }

        const message = await Message.create({
            conversation: req.params.id,
            sender: req.user._id,
            type: 'offer',
            content: note || '',
            offerData: { amount: Number(amount), note: note || '', status: 'pending' },
            readBy: [req.user._id]
        });

        await Conversation.findByIdAndUpdate(req.params.id, {
            lastMessage: message._id,
            lastMessageAt: new Date()
        });

        const populated = await Message.findById(message._id).populate('sender', 'fullName profilePicture');

        // 🔴 Real-time: notify recipient(s)
        emitToRecipients(conversation, req.user._id, populated);

        // 🔔 In-app notification — offer received
        const senderName = populated.sender?.fullName || 'Someone';
        conversation.participants.forEach(participantId => {
            if (participantId.toString() !== req.user._id.toString()) {
                createAndEmitNotification(
                    participantId,
                    'new_offer',
                    `Offer of ₹${Number(amount).toLocaleString('en-IN')} from ${senderName}`,
                    note ? `"${note.slice(0, 60)}"` : 'Tap to view in chat',
                    { conversationId: conversation._id }
                );
            }
        });

        res.status(201).json({ success: true, message: populated });
    } catch (err) {
        console.error('Error sending offer:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ─────────────────────────────────────────────
// PATCH /api/chat/messages/:msgId/offer
// Accept or reject a negotiation offer
// ─────────────────────────────────────────────
router.patch('/messages/:msgId/offer', authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status must be accepted or rejected' });
        }

        const message = await Message.findById(req.params.msgId);
        if (!message || message.type !== 'offer') {
            return res.status(404).json({ success: false, message: 'Offer message not found' });
        }

        if (message.sender.toString() === req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Cannot respond to your own offer' });
        }

        const conversation = await Conversation.findById(message.conversation);
        const isParticipant = conversation?.participants.some(p => p.toString() === req.user._id.toString());
        if (!isParticipant) return res.status(403).json({ success: false, message: 'Access denied' });

        message.offerData.status = status;
        await message.save();

        // Auto-create a Deal when accepted via chat
        if (status === 'accepted') {
            const existingDeal = await Deal.findOne({ sourceId: message._id, source: 'chat' });
            if (!existingDeal) {
                // Determine the buyer/seller:
                // The offer sender is the buyer; the other participant is the seller
                const product = await Product.findById(conversation.product).select('seller');
                const sellerId = product?.seller;
                const buyerId = conversation.participants.find(
                    p => p.toString() !== sellerId?.toString()
                );

                if (buyerId && sellerId) {
                    await Deal.create({
                        product: conversation.product,
                        buyer: buyerId,
                        seller: sellerId,
                        agreedPrice: message.offerData.amount,
                        source: 'chat',
                        sourceId: message._id
                    });
                }
            }
        }

        const populated = await Message.findById(message._id).populate('sender', 'fullName profilePicture');
        res.json({ success: true, message: populated });
    } catch (err) {
        console.error('Error responding to offer:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ─────────────────────────────────────────────
// DELETE /api/chat/conversations/:id
// Delete a conversation and all its messages
// ─────────────────────────────────────────────
router.delete('/conversations/:id', authenticate, async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

        const isParticipant = conversation.participants.some(p => p.toString() === req.user._id.toString());
        if (!isParticipant) return res.status(403).json({ success: false, message: 'Access denied' });

        // Delete all messages in the conversation first
        await Message.deleteMany({ conversation: req.params.id });

        // Delete the conversation itself
        await Conversation.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Conversation deleted' });
    } catch (err) {
        console.error('Error deleting conversation:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
