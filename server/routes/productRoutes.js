import express from 'express';
import { createProduct, getProducts, getProductById, deleteProduct } from '../controllers/productController.js';
import { verifyToken, isFarmer } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(verifyToken, isFarmer, upload.array('images', 5), createProduct);

router.route('/:id')
  .get(getProductById)
  .delete(verifyToken, isFarmer, deleteProduct);

export default router;
