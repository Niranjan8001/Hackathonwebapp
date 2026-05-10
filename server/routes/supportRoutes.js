import express from 'express';
import { createSupportTicket, getMySupportTickets } from '../controllers/supportController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/tickets')
  .post(verifyToken, createSupportTicket)
  .get(verifyToken, getMySupportTickets);

export default router;
