import express from 'express';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { authenticate } from '../middleware/auth.js';
import passport from '../config/passport.js';

const router = express.Router();

// ========== LOCAL AUTH ==========

// Register with email/password + ID verification
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, enrollmentNumber, branch, year, isVerified } = req.body;

    console.log('📝 Registration attempt:', { email, fullName, enrollmentNumber });

    // Validation
    if (!email || !password || !fullName || !enrollmentNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      fullName,
      enrollmentNumber,
      branch,
      year,
      authProvider: 'local',
      isVerified: isVerified || true, // Auto-verify local signups
      verificationStatus: isVerified ? 'approved' : 'approved'
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    console.log('✅ User registered:', user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        enrollmentNumber: user.enrollmentNumber,
        branch: user.branch,
        year: user.year,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Login with email/password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔑 Login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user registered with Google
    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({ error: 'Please login with Google' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    console.log('✅ Login successful:', user._id);

    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        enrollmentNumber: user.enrollmentNumber,
        branch: user.branch,
        year: user.year,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ========== GOOGLE OAUTH ==========

// Initiate Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${process.env.FRONTEND_URL}/?error=google_auth_failed` 
  }),
  async (req, res) => {
    try {
      const user = req.user;

      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Save refresh token
      user.refreshToken = refreshToken;
      await user.save();

      console.log('✅ Google OAuth successful:', user._id);

      // Encode user data for URL
      const userData = encodeURIComponent(JSON.stringify({
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        isVerified: user.isVerified,
        enrollmentNumber: user.enrollmentNumber,
        branch: user.branch,
        year: user.year,
        profilePicture: user.profilePicture
      }));

      // Redirect to frontend with tokens AND user data
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${userData}`
      );
    } catch (error) {
      console.error('❌ Google callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/?error=auth_failed`);
    }
  }
);

// ========== ID VERIFICATION (NEW!) ==========

// Verify enrollment ID for Google OAuth users
router.post('/verify-id', authenticate, async (req, res) => {
  try {
    const { fullName, enrollmentNumber, branch, year } = req.body;
    const userId = req.user._id;

    console.log('🔍 ID Verification attempt:', { userId, fullName, enrollmentNumber });

    // Validation
    if (!fullName || !enrollmentNumber) {
      return res.status(400).json({ 
        success: false,
        message: 'Full name and enrollment number required' 
      });
    }

    // Check if already verified
    if (req.user.isVerified) {
      return res.status(400).json({ 
        success: false,
        message: 'Account already verified' 
      });
    }

    // Update user
    req.user.enrollmentNumber = enrollmentNumber;
    req.user.fullName = fullName;
    if (branch) req.user.branch = branch;
    if (year) req.user.year = year;
    req.user.isVerified = true;
    req.user.verificationStatus = 'approved';
    await req.user.save();

    console.log('✅ ID Verification successful:', userId);

    res.json({
      success: true,
      message: 'ID verification successful',
      user: {
        id: req.user._id,
        email: req.user.email,
        fullName: req.user.fullName,
        enrollmentNumber: req.user.enrollmentNumber,
        branch: req.user.branch,
        year: req.user.year,
        isVerified: req.user.isVerified,
        verificationStatus: req.user.verificationStatus
      }
    });
  } catch (error) {
    console.error('❌ Verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Verification failed', 
      error: error.message 
    });
  }
});

// ========== TOKEN REFRESH ==========

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    res.json({ 
      success: true,
      accessToken: newAccessToken 
    });
  } catch (error) {
    console.error('❌ Refresh token error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// ========== LOGOUT ==========

router.post('/logout', authenticate, async (req, res) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();
    
    console.log('✅ Logout successful:', req.user._id);
    
    res.json({ 
      success: true,
      message: 'Logout successful' 
    });
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// ========== GET CURRENT USER ==========

router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      fullName: req.user.fullName,
      enrollmentNumber: req.user.enrollmentNumber,
      branch: req.user.branch,
      year: req.user.year,
      isVerified: req.user.isVerified,
      verificationStatus: req.user.verificationStatus,
      profilePicture: req.user.profilePicture,
      authProvider: req.user.authProvider,
      createdAt: req.user.createdAt
    }
  });
});

export default router;