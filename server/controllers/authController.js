import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

    const { name, phone, password } = req.body;

    // Validation
    if (!name || !phone || !password) {
      return sendResponse(res, 400, false, 'Please provide name, phone, and password');
    }

    const userExists = await User.findOne({ phone });

    if (userExists) {
      console.log("DEBUG: REGISTER FAILED - User exists", phone);
      return sendResponse(res, 400, false, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashedPassword
    });

    console.log("DEBUG: USER CREATED SUCCESSFULLY", user.phone);

    sendResponse(res, 201, true, 'User registered successfully', {
      _id: user._id,
      name: user.name,
      phone: user.phone,
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
    console.log("DEBUG: LOGIN ATTEMPT", req.body.phone);

    const { phone, password } = req.body;

    if (!phone || !password) {
      return sendResponse(res, 400, false, 'Please provide phone and password');
    }

    const user = await User.findOne({ phone });

    if (user && await bcrypt.compare(password, user.password)) {
      console.log("DEBUG: LOGIN SUCCESS", phone);

      sendResponse(res, 200, true, 'Login success', {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      console.log("DEBUG: LOGIN FAILED", phone);
      sendResponse(res, 401, false, 'Invalid credentials');
    }

  } catch (error) {
    console.error("DEBUG: LOGIN ERROR", error.message);
    next(error);
  }
};
export const getMe = async (req, res) => {
  try {
    console.log("DEBUG: FETCHING PROFILE FOR", req.user.phone);
    sendResponse(res, 200, true, "User profile fetched successfully", req.user);
  } catch (error) {
    console.error("DEBUG: GET_ME ERROR", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};