import express from 'express';
import { getMe, registerUser, loginUser, updateProfile, requestVerification, getModelStatus } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';
import sendResponse from '../utils/response.js';

const router = express.Router();

console.log('DEBUG: Auth Routes loading...');

// Wraps multer to catch Cloudinary/upload errors and return clean JSON
const safeUpload = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error('DEBUG: MULTER/CLOUDINARY ERROR:', err.message);
      return sendResponse(res, 400, false, `File upload failed: ${err.message}`);
    }
    next();
  });
};

const profileUpload = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 },
  { name: 'farmImages', maxCount: 5 }
]);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getMe);
router.put('/update-profile', verifyToken, safeUpload(profileUpload), updateProfile);
router.post('/request-verification', verifyToken, requestVerification);
router.get('/status', getModelStatus);

export default router;