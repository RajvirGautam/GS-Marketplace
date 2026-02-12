import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate tokens
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m'
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d'
  });
};

// Register
export const register = async (req, res) => {
  try {
    const { email, password, fullName, enrollmentNumber, branch, year } = req.body;

    // Validation
    if (!email || !password || !fullName || !enrollmentNumber) {
      return res.status(400).json({ error: 'All fields are required' });
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
      isVerified: true, // Auto-verify for local signups
      verificationStatus: 'approved'
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

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
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

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
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current user (NEW!)
export const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('-password -refreshToken');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        enrollmentNumber: user.enrollmentNumber,
        branch: user.branch,
        year: user.year,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
        avatar: user.avatar,
        authProvider: user.authProvider,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
};

// Google OAuth callback
export const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;
    
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Encode user data for URL
    const userData = encodeURIComponent(JSON.stringify({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      isVerified: user.isVerified,
      enrollmentNumber: user.enrollmentNumber,
      branch: user.branch,
      year: user.year
    }));

    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${userData}`
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/?error=auth_failed`);
  }
};

// Verify ID (NEW!)
export const verifyId = async (req, res) => {
  try {
    const { fullName, enrollmentNumber, branch, year } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!fullName || !enrollmentNumber) {
      return res.status(400).json({ message: 'Full name and enrollment number required' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account already verified' });
    }

    // Update user
    user.enrollmentNumber = enrollmentNumber;
    user.fullName = fullName;
    if (branch) user.branch = branch;
    if (year) user.year = year;
    user.isVerified = true;
    user.verificationStatus = 'approved';
    await user.save();

    res.json({
      success: true,
      message: 'ID verification successful',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        enrollmentNumber: user.enrollmentNumber,
        branch: user.branch,
        year: user.year,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id);

    res.json({
      success: true,
      accessToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Clear refresh token from database
    await User.findByIdAndUpdate(userId, { refreshToken: null });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};
