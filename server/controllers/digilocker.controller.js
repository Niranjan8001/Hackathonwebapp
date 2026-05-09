import DigiLockerService from '../services/digilocker.service.js';
import User from '../models/User.js';
import sendResponse from '../utils/response.js';

/**
 * Initiates the DigiLocker OAuth flow
 */
export const initiateAuth = async (req, res, next) => {
  try {
    const userId = req.userId; // Provided by authMiddleware
    if (!userId) {
      return sendResponse(res, 401, false, 'Authentication required');
    }

    const { url, state, codeVerifier } = await DigiLockerService.getAuthUrl();

    // Store OAuth session data in the user document
    await User.findByIdAndUpdate(userId, {
      'verification.oauthState': state,
      'verification.codeVerifier': codeVerifier,
      'verification.verificationStatus': 'pending'
    });

    console.log(`DEBUG: DigiLocker Auth initiated for user ${userId}. State: ${state}`);

    sendResponse(res, 200, true, 'DigiLocker auth URL generated', { url });
  } catch (error) {
    console.error('DEBUG: DigiLocker Auth Error:', error.message);
    next(error);
  }
};
