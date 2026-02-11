import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// POST /api/users/sync - Sync Clerk user to MongoDB
router.post('/sync', async (req, res) => {
  try {
    const { clerkUserId, email, fullName, enrollmentNumber, isVerified, verificationStatus } = req.body;

    console.log('📨 Received sync request:', { clerkUserId, email, fullName, enrollmentNumber });

    // Validation
    if (!clerkUserId || !email) {
      return res.status(400).json({ error: 'Missing required fields: clerkUserId and email' });
    }

    // Check if user already exists
    let user = await User.findOne({ clerkUserId });

    if (user) {
      // Update existing user
      user.email = email;
      user.fullName = fullName || user.fullName;
      user.enrollmentNumber = enrollmentNumber || user.enrollmentNumber;
      user.isVerified = isVerified !== undefined ? isVerified : user.isVerified;
      user.verificationStatus = verificationStatus || user.verificationStatus;
      user.updatedAt = Date.now();
      
      await user.save();
      console.log('✅ User updated:', user._id);
      return res.status(200).json({ message: 'User updated', user });
    }

    // Create new user
    user = new User({
      clerkUserId,
      email,
      fullName,
      enrollmentNumber,
      isVerified: isVerified || false,
      verificationStatus: verificationStatus || 'pending'
    });

    await user.save();
    console.log('✅ User created:', user._id);
    res.status(201).json({ message: 'User created', user });

  } catch (error) {
    console.error('❌ Error syncing user:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// GET /api/users/:clerkUserId - Get user by Clerk ID
router.get('/:clerkUserId', async (req, res) => {
  try {
    const user = await User.findOne({ clerkUserId: req.params.clerkUserId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;