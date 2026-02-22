import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// A conversation is unique per (product, sorted-participants-pair)
conversationSchema.index({ product: 1, participants: 1 });

export default mongoose.model('Conversation', conversationSchema);
