import sendResponse from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  // Handle string errors (e.g. from multer-storage-cloudinary)
  const error = typeof err === 'string' ? new Error(err) : err;

  console.error(`[ERROR] ${req.method} ${req.originalUrl} — ${error.message}`);
  if (error.stack) {
    console.error(error.stack);
  }

  // Prevent crash if headers already sent
  if (res.headersSent) {
    return next(error);
  }

  // MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    return sendResponse(res, 400, false, `Duplicate value for ${field}.`);
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(e => e.message);
    return sendResponse(res, 400, false, messages.join(', '));
  }

  // Multer file upload error
  if (error.name === 'MulterError') {
    return sendResponse(res, 400, false, `Upload error: ${error.message}`);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  sendResponse(res, statusCode, false, error.message || 'Server Error');
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
