import express from 'express';
import { getMe, registerUser, loginUser, firebaseLogin } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

console.log('DEBUG: Auth Routes loading...');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/firebase-login', firebaseLogin);
router.get('/me', verifyToken, getMe);

export default router;