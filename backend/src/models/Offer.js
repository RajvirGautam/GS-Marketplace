import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    offerPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'countered', 'cancelled'],
        default: 'pending'
    },
    message: {
        type: String,
        trim: true,
        maxLength: 500
    },
    expiresAt: {
        type: Date,
        default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) // 7 days expiry
    }
}, {
    timestamps: true
});

// Index for quick lookups
offerSchema.index({ product: 1, buyer: 1 });
offerSchema.index({ seller: 1, status: 1 });

export default mongoose.model('Offer', offerSchema);
