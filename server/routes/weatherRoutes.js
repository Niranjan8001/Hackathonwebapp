import express from 'express';
import { getWeatherByPincode } from '../controllers/weatherController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:pincode', verifyToken, getWeatherByPincode);

export default router;
