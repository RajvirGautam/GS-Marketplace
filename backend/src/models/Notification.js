import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['new_offer', 'offer_accepted', 'offer_rejected', 'new_message', 'deal_done'],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        trim: true,
        default: ''
    },
    // Extra data for CTA navigation
    meta: {
        offerId: { type: mongoose.Schema.Types.ObjectId, default: null },
        dealId: { type: mongoose.Schema.Types.ObjectId, default: null },
        conversationId: { type: mongoose.Schema.Types.ObjectId, default: null },
        productId: { type: mongoose.Schema.Types.ObjectId, default: null },
        productTitle: { type: String, default: '' },
        price: { type: Number, default: null }
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Auto-delete notifications older than 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.model('Notification', notificationSchema);
