import express from 'express';
import { createProduct, getProducts, getProductById, deleteProduct, getMyProducts, updateProduct } from '../controllers/productController.js';
import { getCategories } from '../controllers/categoryController.js';
import { verifyToken, isFarmer } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';


const router = express.Router();

router.get('/categories', getCategories);

router.route('/')
  .get(getProducts)
  .post(verifyToken, isFarmer, upload.array('images', 5), createProduct);

router.get('/my-products', verifyToken, getMyProducts);

router.route('/:id')
  .get(getProductById)
  .put(verifyToken, isFarmer, upload.array('images', 5), updateProduct)
  .delete(verifyToken, isFarmer, deleteProduct);

export default router;
