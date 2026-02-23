import express from 'express';
import Deal from '../models/Deal.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/deals — All deals for the current user (as buyer or seller)
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user._id;
        const deals = await Deal.find({
            $or: [{ buyer: userId }, { seller: userId }]
        })
            .populate('product', 'title price images status')
            .populate('buyer', 'fullName profilePicture branch year')
            .populate('seller', 'fullName profilePicture branch year')
            .sort({ createdAt: -1 });

        res.json({ success: true, deals });
    } catch (error) {
        console.error('Error fetching deals:', error);
        res.status(500).json({ success: false, message: 'Error fetching deals' });
    }
});

// PATCH /api/deals/:id/confirm-sold — Either buyer or seller can confirm (mark as sold)
router.patch('/:id/confirm-sold', authenticate, async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);
        if (!deal) {
            return res.status(404).json({ success: false, message: 'Deal not found' });
        }

        const userId = req.user._id.toString();
        const isSeller = deal.seller.toString() === userId;
        const isBuyer = deal.buyer.toString() === userId;

        if (!isSeller && !isBuyer) {
            return res.status(403).json({ success: false, message: 'You are not part of this deal' });
        }

        if (deal.dealStatus === 'sold') {
            return res.status(400).json({ success: false, message: 'Deal is already marked as sold' });
        }

        // Either party confirming seals the deal
        deal.sellerConfirmedSold = true;
        deal.dealStatus = 'sold';
        await deal.save();

        // Mark the product as sold and remove it from active marketplace
        await Product.findByIdAndUpdate(deal.product, { status: 'sold' });

        const populated = await Deal.findById(deal._id)
            .populate('product', 'title price images status')
            .populate('buyer', 'fullName profilePicture branch year')
            .populate('seller', 'fullName profilePicture branch year');

        res.json({ success: true, deal: populated });
    } catch (error) {
        console.error('Error confirming deal as sold:', error);
        res.status(500).json({ success: false, message: 'Error confirming deal' });
    }
});


// PATCH /api/deals/:id/review — Buyer submits a review
router.patch('/:id/review', authenticate, async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }

        const deal = await Deal.findById(req.params.id);
        if (!deal) {
            return res.status(404).json({ success: false, message: 'Deal not found' });
        }

        if (deal.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Only the buyer can submit a review' });
        }

        if (deal.dealStatus !== 'sold') {
            return res.status(400).json({ success: false, message: 'You can only review a confirmed deal' });
        }

        if (deal.review && deal.review.submittedAt) {
            return res.status(400).json({ success: false, message: 'You have already submitted a review for this deal' });
        }

        deal.review = {
            rating: Number(rating),
            comment: comment?.trim() || '',
            submittedAt: new Date()
        };
        await deal.save();

        const populated = await Deal.findById(deal._id)
            .populate('product', 'title price images status')
            .populate('buyer', 'fullName profilePicture branch year')
            .populate('seller', 'fullName profilePicture branch year');

        res.json({ success: true, deal: populated });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ success: false, message: 'Error submitting review' });
    }
});

export default router;
