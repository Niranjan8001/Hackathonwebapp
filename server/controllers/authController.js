import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { admin } from '../config/firebase.js';
import sendResponse from '../utils/response.js';

// 🔐 Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// ✅ REGISTER
export const registerUser = async (req, res, next) => {
  try {
    console.log("DEBUG: REGISTER ATTEMPT", req.body);

    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return sendResponse(res, 400, false, 'Please provide name, email, and password');
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      console.log("DEBUG: REGISTER FAILED - User exists", email);
      return sendResponse(res, 400, false, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'farmer'
    });

    console.log("DEBUG: USER CREATED SUCCESSFULLY", user.email);

    sendResponse(res, 201, true, 'User registered successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error("DEBUG: REGISTER ERROR", error.message);
    next(error);
  }
};

// ✅ LOGIN
export const loginUser = async (req, res, next) => {
  try {
    console.log("DEBUG: LOGIN ATTEMPT", req.body.email);

    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, false, 'Please provide email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && await bcrypt.compare(password, user.password)) {
      console.log("DEBUG: LOGIN SUCCESS", email);

      sendResponse(res, 200, true, 'Login success', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      console.log("DEBUG: LOGIN FAILED", email);
      sendResponse(res, 401, false, 'Invalid credentials');
    }

  } catch (error) {
    console.error("DEBUG: LOGIN ERROR", error.message);
    next(error);
  }
};
export const getMe = async (req, res) => {
  try {
    console.log("DEBUG: FETCHING PROFILE FOR", req.user.email);
    sendResponse(res, 200, true, "User profile fetched successfully", req.user);
  } catch (error) {
    console.error("DEBUG: GET_ME ERROR", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    const updates = req.body;
    
    // Handle specific array pushes if needed, or just overwrite
    // For certifications, we might want to push
    if (updates.certification) {
      user.certifications.push(updates.certification);
      delete updates.certification;
    }

    Object.keys(updates).forEach(key => {
      user[key] = updates[key];
    });

    await user.save();

    sendResponse(res, 200, true, 'Profile updated successfully', user);
  } catch (error) {
    next(error);
  }
};