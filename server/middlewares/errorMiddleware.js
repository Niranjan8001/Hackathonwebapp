import sendResponse from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  // Handle string errors (e.g. from multer-storage-cloudinary)
  const error = typeof err === 'string' ? new Error(err) : err;

  console.error(`[ERROR] ${req.method} ${req.originalUrl} — ${error.message}`);
  if (error.stack) {
    console.error(error.stack);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  sendResponse(res, statusCode, false, error.message || 'Server Error');
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
