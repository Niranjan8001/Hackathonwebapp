import express from 'express';
import { getEarningsReportData } from '../controllers/earningsController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/report', verifyToken, getEarningsReportData);

export default router;
