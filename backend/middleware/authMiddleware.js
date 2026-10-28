import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getMongoStatus } from '../config/db.js';
import { findMemoryUserById } from '../controllers/authController.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecretjwtkey_123456789_mern_blog'
      );

      if (getMongoStatus()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = findMemoryUserById(decoded.id);
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found. Invalid token session.' });
      }

      next();
    } catch (error) {
      console.error('Auth protect error:', error.message);
      return res.status(401).json({ message: 'Not authorized. Token verification failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing.' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Role '${req.user?.role || 'Guest'}' is not authorized for this resource.`,
      });
    }
    next();
  };
};
