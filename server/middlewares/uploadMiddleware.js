import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { configureCloudinary } from "../config/cloudinary.js";

// Use lazy initialization — storage is created on first use,
// which is at request time (after dotenv.config() has already run).
let _upload = null;

function getUpload() {
  if (!_upload) {
    configureCloudinary(); // Safe: called at request time, env vars are loaded

    const storage = new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => ({
        folder: "products",
        format: file.mimetype.split("/")[1],
      }),
    });

    _upload = multer({ storage });
  }
  return _upload;
}

// Export a middleware wrapper that lazily initializes multer
const upload = {
  array: (fieldName, maxCount) => (req, res, next) => {
    getUpload().array(fieldName, maxCount)(req, res, next);
  },
  single: (fieldName) => (req, res, next) => {
    getUpload().single(fieldName)(req, res, next);
  },
  fields: (fieldsArray) => (req, res, next) => {
    getUpload().fields(fieldsArray)(req, res, next);
  },
};

export default upload;