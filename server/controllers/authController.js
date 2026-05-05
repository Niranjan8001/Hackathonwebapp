import sendResponse from '../utils/response.js';

export const getMe = async (req, res, next) => {
  try {
    sendResponse(res, 200, true, 'User profile fetched successfully', req.user);
  } catch (error) {
    next(error);
  }
};
