import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';
import { io } from '../server.js';

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
            { folder, resource_type: resourceType },
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
            io.to(`user:${participantId}`).emit('new_message', {
                conversationId: conversation._id.toString(),
                message
            });
        }
    });
};

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
            .populate('product', 'title images price')
            .populate({ path: 'lastMessage', select: 'content type createdAt' });

        if (!conversation) {
            conversation = await Conversation.create({ participants, product: productId });
            conversation = await Conversation.findById(conversation._id)
                .populate('participants', 'fullName profilePicture')
                .populate('product', 'title images price');
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
            .populate('product', 'title images price')
            .populate({ path: 'lastMessage', select: 'content type createdAt sender' })
            .sort({ lastMessageAt: -1 });

        res.json({ success: true, conversations });
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
        await Message.updateMany(
            { conversation: req.params.id, readBy: { $ne: req.user._id } },
            { $addToSet: { readBy: req.user._id } }
        );

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

        res.status(201).json({ success: true, message: populated });
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ─────────────────────────────────────────────
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

        const populated = await Message.findById(message._id).populate('sender', 'fullName profilePicture');
        res.json({ success: true, message: populated });
    } catch (err) {
        console.error('Error responding to offer:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
