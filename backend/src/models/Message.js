import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'media', 'offer'],
        default: 'text'
    },
    content: {
        type: String,
        default: ''
    },
    mediaUrl: {
        type: String,
        default: ''
    },
    mediaType: {
        type: String, // 'image', 'video', 'file'
        default: ''
    },
    offerData: {
        amount: { type: Number },
        note: { type: String, default: '' },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        }
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

messageSchema.index({ conversation: 1, createdAt: 1 });

export default mongoose.model('Message', messageSchema);
