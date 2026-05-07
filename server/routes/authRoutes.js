import express from 'express';
import { getMe, registerUser, loginUser, updateProfile } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

console.log('DEBUG: Auth Routes loading...');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getMe);
router.put('/update-profile', verifyToken, upload.single('profilePhoto'), updateProfile);

export default router;