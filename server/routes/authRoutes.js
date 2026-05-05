import express from 'express';
import { getMe, registerUser, loginUser, updateProfile } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

console.log('DEBUG: Auth Routes loading...');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getMe);
router.put('/update-profile', verifyToken, updateProfile);

export default router;