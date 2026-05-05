import express from 'express';
const router = express.Router();
import * as reviewController from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

router.get('/my-reviews', verifyToken, reviewController.getFarmerReviews);
router.post('/:id/reply', verifyToken, reviewController.replyToReview);

export default router;
