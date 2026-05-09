import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendResponse from '../utils/response.js';

export const verifyToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      req.userId = decoded.id;
      
      if (!req.user) {
        return sendResponse(res, 404, false, 'User not found');
      }

      return next();
    } catch (error) {
      console.error('Token Verification Error:', error.message);
      return sendResponse(res, 401, false, 'Not authorized, token failed');
    }
  }

  if (!token) {
    return sendResponse(res, 401, false, 'Not authorized, no token');
  }
};

export const isFarmer = (req, res, next) => {
  if (req.user && req.user.role === 'farmer') {
    next();
  } else {
    return sendResponse(res, 403, false, 'Not authorized as a farmer');
  }
};

export const isBuyer = (req, res, next) => {
  if (req.user && req.user.role === 'buyer') {
    next();
  } else {
    return sendResponse(res, 403, false, 'Not authorized as a buyer');
  }
};
