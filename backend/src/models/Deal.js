import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
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
    agreedPrice: {
        type: Number,
        required: true
    },
    // 'offer' = came from offerRoutes, 'chat' = came from chat price negotiation
    source: {
        type: String,
        enum: ['offer', 'chat'],
        required: true
    },
    // ObjectId of the source Offer doc or chat Message doc
    sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    // The seller must explicitly confirm the deal as sold
    sellerConfirmedSold: {
        type: Boolean,
        default: false
    },
    dealStatus: {
        type: String,
        enum: ['active', 'sold'],
        default: 'active'
    },
    // Buyer review (populated after seller confirms sold)
    review: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            trim: true,
            maxLength: 1000
        },
        submittedAt: {
            type: Date
        }
    }
}, {
    timestamps: true
});

dealSchema.index({ buyer: 1 });
dealSchema.index({ seller: 1 });
dealSchema.index({ product: 1 });

export default mongoose.model('Deal', dealSchema);
