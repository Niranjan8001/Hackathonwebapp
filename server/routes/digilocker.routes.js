import express from 'express';
import { initiateAuth } from '../controllers/digilocker.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route GET /api/digilocker/auth
 * @desc Initiate DigiLocker OAuth 2.0 flow
 * @access Private
 */
router.get('/auth',verifyToken, initiateAuth);

export default router;
