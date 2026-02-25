import express from 'express';
import Offer from '../models/Offer.js';
import Product from '../models/Product.js';
import Deal from '../models/Deal.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { io } from '../server.js';
import { authenticate } from '../middleware/auth.js';
import { sendMail } from '../utils/mailer.js';
import { newOfferTemplate, offerAcceptedTemplate } from '../utils/emailTemplates.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// POST /api/offers - Create a new offer
router.post('/', authenticate, async (req, res) => {
    try {
        const { productId, offerPrice, message } = req.body;
        const buyerId = req.user._id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (product.seller.toString() === buyerId.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot make an offer on your own product' });
        }

        // Check if an active offer already exists
        const existingOffer = await Offer.findOne({ product: productId, buyer: buyerId, status: 'pending' });
        if (existingOffer) {
            return res.status(400).json({ success: false, message: 'You already have a pending offer for this product' });
        }

        const offer = new Offer({
            product: productId,
            buyer: buyerId,
            seller: product.seller,
            offerPrice,
            message
        });

        await offer.save();

        // Fire-and-forget: notify seller via email + in-app notification
        notifySellerNewOffer(offer).catch(() => { });
        createAndEmitNotification(
            offer.seller,
            'new_offer',
            'New Offer Received 💰',
            `Someone made an offer on your listing`,
            { offerId: offer._id, productId: offer.product }
        ).catch(() => { });

        res.status(201).json({ success: true, offer });
    } catch (error) {
        console.error('Error creating offer:', error);
        res.status(500).json({ success: false, message: 'Error creating offer', error: error.message });
    }
});

// GET /api/offers/received - Get offers received by the seller
router.get('/received', authenticate, async (req, res) => {
    try {
        const offers = await Offer.find({ seller: req.user._id })
            .populate('product', 'title price images')
            .populate('buyer', 'fullName profilePicture branch year')
            .sort({ createdAt: -1 });

        res.json({ success: true, offers });
    } catch (error) {
        console.error('Error fetching received offers:', error);
        res.status(500).json({ success: false, message: 'Error fetching offers' });
    }
});

// GET /api/offers/sent - Get offers sent by the buyer
router.get('/sent', authenticate, async (req, res) => {
    try {
        const offers = await Offer.find({ buyer: req.user._id })
            .populate('product', 'title price images')
            .populate('seller', 'fullName profilePicture branch year')
            .sort({ createdAt: -1 });

        res.json({ success: true, offers });
    } catch (error) {
        console.error('Error fetching sent offers:', error);
        res.status(500).json({ success: false, message: 'Error fetching offers' });
    }
});

// PATCH /api/offers/:id/status - Update offer status (Accept/Reject/Cancel)
router.patch('/:id/status', authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        const offer = await Offer.findById(req.params.id);

        if (!offer) {
            return res.status(404).json({ success: false, message: 'Offer not found' });
        }

        // Authorization
        const isSeller = offer.seller.toString() === req.user._id.toString();
        const isBuyer = offer.buyer.toString() === req.user._id.toString();

        if (status === 'accepted' || status === 'rejected') {
            if (!isSeller) return res.status(403).json({ success: false, message: 'Not authorized' });
        } else if (status === 'cancelled') {
            if (!isBuyer) return res.status(403).json({ success: false, message: 'Not authorized' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid status update' });
        }

        offer.status = status;
        await offer.save();

        // Auto-create a Deal when the seller accepts
        if (status === 'accepted') {
            const existingDeal = await Deal.findOne({ sourceId: offer._id, source: 'offer' });
            if (!existingDeal) {
                await Deal.create({
                    product: offer.product,
                    buyer: offer.buyer,
                    seller: offer.seller,
                    agreedPrice: offer.offerPrice,
                    source: 'offer',
                    sourceId: offer._id
                });
            }
            // Fire-and-forget: open/reuse a chat and send a preset acceptance message
            autoSendAcceptanceChat(offer);
            // Fire-and-forget: notify buyer via email + in-app notification that deal is done
            notifyBuyerOfferAccepted(offer).catch(() => { });
            createAndEmitNotification(
                offer.buyer,
                'offer_accepted',
                'Your Offer Was Accepted! 🎉',
                `Deal confirmed — check My Deals to coordinate handover`,
                { offerId: offer._id, productId: offer.product }
            ).catch(() => { });
        }

        if (status === 'rejected') {
            createAndEmitNotification(
                offer.buyer,
                'offer_rejected',
                'Offer Declined',
                `The seller passed on your offer`,
                { offerId: offer._id, productId: offer.product }
            ).catch(() => { });
        }

        res.json({ success: true, offer });
    } catch (error) {
        console.error('Error updating offer status:', error);
        res.status(500).json({ success: false, message: 'Error updating status' });
    }
});

// ─── Helper: notify seller of new incoming offer ─────────────────────────────
async function notifySellerNewOffer(offer) {
    try {
        const [seller, buyer, product] = await Promise.all([
            User.findById(offer.seller).select('fullName email'),
            User.findById(offer.buyer).select('fullName'),
            Product.findById(offer.product).select('title price'),
        ]);
        if (!seller?.email) return;

        const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard?tab=negotiations`;

        await sendMail({
            to: seller.email,
            subject: `New Offer on "${product?.title}" — GS Marketplace`,
            html: newOfferTemplate({
                sellerName: seller.fullName,
                buyerName: buyer?.fullName || 'A buyer',
                productTitle: product?.title || 'your listing',
                offerPrice: offer.offerPrice,
                originalPrice: product?.price || offer.offerPrice,
                message: offer.message || '',
                dashboardUrl,
            }),
        });
    } catch (err) {
        console.error('[mailer] notifySellerNewOffer error:', err.message);
    }
}

// ─── Helper: notify buyer that their offer was accepted ───────────────────────
async function notifyBuyerOfferAccepted(offer) {
    try {
        const [buyer, seller, product] = await Promise.all([
            User.findById(offer.buyer).select('fullName email'),
            User.findById(offer.seller).select('fullName'),
            Product.findById(offer.product).select('title price'),
        ]);
        if (!buyer?.email) return;

        const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard?tab=deals`;

        await sendMail({
            to: buyer.email,
            subject: `Your Offer Was Accepted! 🎉 — GS Marketplace`,
            html: offerAcceptedTemplate({
                buyerName: buyer.fullName,
                sellerName: seller?.fullName || 'The seller',
                productTitle: product?.title || 'your item',
                agreedPrice: offer.offerPrice,
                originalPrice: product?.price || offer.offerPrice,
                dashboardUrl,
            }),
        });
    } catch (err) {
        console.error('[mailer] notifyBuyerOfferAccepted error:', err.message);
    }
}

// ─── Helper: auto-send acceptance chat message ────────────────────────────────
async function autoSendAcceptanceChat(offer) {
    try {
        const product = await Product.findById(offer.product).select('title price seller');
        if (!product) return;

        const buyerId = offer.buyer;
        const sellerId = offer.seller;

        // Sort participants the same way chatRoutes does
        const participants = [buyerId, sellerId]
            .map(id => id.toString())
            .sort()
            .map(id => id);

        // Find or create conversation
        let conv = await Conversation.findOne({
            product: offer.product,
            participants: { $all: participants, $size: 2 }
        });

        if (!conv) {
            conv = await Conversation.create({ participants, product: offer.product });
        }

        const discount = product.price - offer.offerPrice;
        const pct = product.price > 0 ? Math.round((discount / product.price) * 100) : 0;

        const text = [
            `🎉 Offer accepted for "${product.title}"!`,
            `Agreed price: ₹${offer.offerPrice}${pct > 0 ? ` (${pct}% off ₹${product.price})` : ''}`,
            ` Please coordinate where and when to meet to complete the handover.`,
            ` Once done, mark it as ✓ Received in My Deals.`,
        ].join('\n');

        const msg = await Message.create({
            conversation: conv._id,
            sender: sellerId,
            type: 'text',
            content: text,
            readBy: [sellerId],
        });

        // Update conversation's last message
        await Conversation.findByIdAndUpdate(conv._id, {
            lastMessage: msg._id,
            lastMessageAt: new Date(),
        });

        // Emit to buyer in real-time
        io.to(`user:${buyerId}`).emit('new_message', {
            conversationId: conv._id.toString(),
            message: msg,
        });
    } catch (err) {
        console.error('Auto-chat error on offer acceptance:', err);
    }
}
// ─── Helper: create Notification doc + emit real-time socket event ────────────
async function createAndEmitNotification(userId, type, title, body, meta = {}) {
    try {
        const notif = await Notification.create({ userId, type, title, body, meta });
        io.to(`user:${userId.toString()}`).emit('new_notification', notif);
    } catch (err) {
        console.error('[notification] createAndEmitNotification error:', err.message);
    }
}

export default router;
