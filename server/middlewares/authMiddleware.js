import { admin } from '../config/firebase.js';
import { isMockMode } from '../config/mockConfig.js';
import { mockUsers } from '../mock/mockUsers.js';
import User from '../models/User.js';
import sendResponse from '../utils/response.js';

export const verifyToken = async (req, res, next) => {
  if (isMockMode()) {
    // Default to mock farmer for testing
    req.user = mockUsers.find(u => u.role === 'farmer');
    return next();
  }

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      let user = await User.findOne({ email: decodedToken.email });
      if (!user) {
        user = await User.create({
          name: decodedToken.name || 'Unknown',
          email: decodedToken.email,
          phone: decodedToken.phone_number || null,
          role: 'buyer'
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      return sendResponse(res, 401, false, 'Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    return sendResponse(res, 401, false, 'Not authorized, no token');
  }
};

export const isFarmer = (req, res, next) => {
  if (req.user && req.user.role === 'farmer') {
    next();
  } else {
    res.status(403);
    return sendResponse(res, 403, false, 'Not authorized as a farmer');
  }
};

export const isBuyer = (req, res, next) => {
  if (req.user && req.user.role === 'buyer') {
    next();
  } else {
    res.status(403);
    return sendResponse(res, 403, false, 'Not authorized as a buyer');
  }
};
