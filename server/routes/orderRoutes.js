import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { verifyToken, isBuyer, isFarmer } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(verifyToken, isBuyer, createOrder)
  .get(verifyToken, getOrders);

router.route('/:id/status')
  .patch(verifyToken, isFarmer, updateOrderStatus);

export default router;
