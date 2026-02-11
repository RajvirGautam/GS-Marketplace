import { verifyAccessToken } from './utils/jwt.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header or cookie
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    // Attach user to request
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed.' });
  }
};

export const requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ error: 'Please verify your ID card first.' });
  }
  next();
};