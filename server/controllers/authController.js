import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { admin } from '../config/firebase.js';
import sendResponse from '../utils/response.js';

// 📈 Profile Completion Helper
export const calculateProfileCompletion = (user) => {
  let completion = 0;
  
  // 1. Personal Information (25%)
  const personalFields = ['name', 'email', 'dob'];
  const personalScore = personalFields.filter(f => !!user[f]).length;
  if (personalScore === personalFields.length) completion += 25;
  else completion += (personalScore / personalFields.length) * 25;

  // 2. Farm Details (25%)
  const farmFields = ['farmName', 'villageLocality'];
  let farmScore = farmFields.filter(f => !!user[f]).length;
  if (user.primaryCrops && user.primaryCrops.length > 0) farmScore += 1;
  const totalFarmFields = farmFields.length + 1;
  if (farmScore === totalFarmFields) completion += 25;
  else completion += (farmScore / totalFarmFields) * 25;

  // 3. Uploaded Documents (25%)
  // Using farmImages as a proxy for uploaded documents
  if (user.farmImages && user.farmImages.length > 0) {
    completion += 25;
  }

  // 4. Bank Details (25%)
  const bankFields = ['accountHolderName', 'accountNumber', 'ifscCode', 'bankName', 'accountType', 'branchName'];
  const bankScore = bankFields.filter(f => !!user[f]).length;
  if (bankScore === bankFields.length) completion += 25;
  else completion += (bankScore / bankFields.length) * 25;

  return Math.round(completion);
};


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
      profilePhoto: user.profilePhoto,
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error("DEBUG: REGISTER ERROR", error.message);
    
    // Handle MongoDB duplicate key errors (e.g. email already exists)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return sendResponse(res, 400, false, `An account with this ${field} already exists.`);
    }
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return sendResponse(res, 400, false, messages.join(', '));
    }
    
    sendResponse(res, 500, false, 'Registration failed. Please try again later.');
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
        profilePhoto: user.profilePhoto,
        token: generateToken(user._id)
      });
    } else {
      console.log("DEBUG: LOGIN FAILED", email);
      sendResponse(res, 401, false, 'Invalid credentials');
    }

  } catch (error) {
    console.error("DEBUG: LOGIN ERROR", error.message);
    sendResponse(res, 500, false, 'Login failed. Please try again later.');
  }
};
export const getMe = async (req, res) => {
  try {
    console.log("DEBUG: FETCHING PROFILE FOR", req.user.email);
    
    const completion = calculateProfileCompletion(req.user);
    
    // Legacy fix: auto-migrate 'none' or null to 'Not Eligible'
    if (!req.user.verification) {
      req.user.verification = { verificationStatus: 'Not Eligible' };
      await req.user.save();
    } else {
      const currentStatus = req.user.verification.verificationStatus;
      if (currentStatus === 'none' || currentStatus === 'pending' || currentStatus === 'failed') {
        req.user.verification.verificationStatus = 'Not Eligible';
        await req.user.save();
      }
    }

    // Auto-update status to "Ready for Verification" if completion >= 75% and status is "Not Eligible"
    if (completion >= 75 && req.user.verification.verificationStatus === 'Not Eligible') {

      req.user.verification.verificationStatus = 'Ready for Verification';
      await req.user.save();
    } else if (completion < 75 && req.user.verification.verificationStatus === 'Ready for Verification') {
      req.user.verification.verificationStatus = 'Not Eligible';
      await req.user.save();
    }

    const userData = req.user.toObject();
    userData.profileCompletion = completion;

    sendResponse(res, 200, true, "User profile fetched successfully", userData);
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

    const updates = { ...req.body };
    
    // Handle legacy status if present in document
    if (!user.verification) {
      user.verification = { verificationStatus: 'Not Eligible' };
    } else if (user.verification.verificationStatus === 'none' || !user.verification.verificationStatus) {
      user.verification.verificationStatus = 'Not Eligible';
    }

    // Handle Profile Photo and Farm Images Upload via Cloudinary

    if (req.files) {
      if (req.files.profilePhoto) {
        updates.profilePhoto = req.files.profilePhoto[0].path;
      }
      if (req.files.bannerImage) {
        updates.bannerImage = req.files.bannerImage[0].path;
      }
      if (req.files.farmImages) {
        const newImages = req.files.farmImages.map(f => f.path);
        const existingImages = req.body.existingFarmImages 
          ? (Array.isArray(req.body.existingFarmImages) ? req.body.existingFarmImages : [req.body.existingFarmImages])
          : [];
        updates.farmImages = [...existingImages, ...newImages];
      } else if (req.body.existingFarmImages) {
        // If no new files but existing images are sent (e.g. some removed)
        updates.farmImages = Array.isArray(req.body.existingFarmImages) 
          ? req.body.existingFarmImages 
          : [req.body.existingFarmImages];
      }
      delete updates.existingFarmImages; // Clean up body field
    } else if (req.file) {
      updates.profilePhoto = req.file.path;
    }

    // Handle specific array pushes if needed
    if (updates.certification) {
      user.certifications.push(updates.certification);
      delete updates.certification;
    }

    Object.keys(updates).forEach(key => {
      user[key] = updates[key];
    });

    await user.save();

    // Return the updated user without password
    const updatedUser = await User.findById(user._id).select('-password');
    const userData = updatedUser.toObject();
    userData.profileCompletion = calculateProfileCompletion(updatedUser);

    sendResponse(res, 200, true, 'Profile updated successfully', userData);
  } catch (error) {
    next(error);
  }
};

// ✅ REQUEST VERIFICATION
export const requestVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    const completion = calculateProfileCompletion(user);

    if (completion < 75) {
      return sendResponse(res, 400, false, 'Complete at least 75% of your profile to request verification.');
    }

    if (user.verification.verificationStatus === 'Verified') {
      return sendResponse(res, 400, false, 'Profile is already verified.');
    }

    if (user.verification.verificationStatus === 'Verification Requested') {
      return sendResponse(res, 400, false, 'Verification is already requested.');
    }

    user.verification.verificationStatus = 'Verification Requested';
    await user.save();

    sendResponse(res, 200, true, 'Verification requested successfully', {
      verificationStatus: user.verification.verificationStatus
    });

  } catch (error) {
    next(error);
  }
};