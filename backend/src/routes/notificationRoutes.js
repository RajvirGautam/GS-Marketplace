import express from 'express';
import Notification from '../models/Notification.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications — fetch latest 30 for current user
router.get('/', authenticate, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(30)
            .lean();

        const unreadCount = notifications.filter(n => !n.isRead).length;
        res.json({ success: true, notifications, unreadCount });
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ success: false, message: 'Error fetching notifications' });
    }
});

// PATCH /api/notifications/read-all — mark all as read
// ⚠️ MUST be before /:id/read so Express doesn't treat "read-all" as an :id param
router.patch('/read-all', authenticate, async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating notifications' });
    }
});

// PATCH /api/notifications/:id/read — mark single as read
router.patch('/:id/read', authenticate, async (req, res) => {
    try {
        const notif = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { isRead: true },
            { new: true }
        );
        if (!notif) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, notification: notif });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating notification' });
    }
});

// DELETE /api/notifications/:id — delete a single notification
router.delete('/:id', authenticate, async (req, res) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting notification' });
    }
});

export default router;
