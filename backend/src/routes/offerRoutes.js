import express from 'express';
import Offer from '../models/Offer.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';

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

        res.json({ success: true, offer });
    } catch (error) {
        console.error('Error updating offer status:', error);
        res.status(500).json({ success: false, message: 'Error updating status' });
    }
});

export default router;
