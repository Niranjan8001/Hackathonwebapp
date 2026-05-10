import express from 'express';
import { getMe, registerUser, loginUser, updateProfile, requestVerification } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

console.log('DEBUG: Auth Routes loading...');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getMe);
router.put('/update-profile', verifyToken, upload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'bannerImage', maxCount: 1 }, { name: 'farmImages', maxCount: 5 }]), updateProfile);
router.post('/request-verification', verifyToken, requestVerification);

export default router;