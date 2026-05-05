import Product from '../models/Product.js';
import sendResponse from '../utils/response.js';

export const createProduct = async (req, res, next) => {
  try {
    const { name, title, price, category, stock, quantity } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    console.log('DEBUG: Creating product with data:', req.body);
    console.log('DEBUG: User from token:', req.user?._id);

    const product = await Product.create({
      farmerId: req.user._id,
      title: title || name,
      price: Number(price),
      category,
      stock: Number(stock || quantity || 0),
      images,
    });

    console.log('DEBUG: Product created successfully:', product._id);
    sendResponse(res, 201, true, 'Product created successfully', product);
  } catch (error) {
    console.error('DEBUG: Error in createProduct:', error.message);
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { farmerId } = req.query;

    const filter = farmerId ? { farmerId } : {};
    
    const products = await Product.find(filter).populate('farmerId', 'name location');
    sendResponse(res, 200, true, 'Products fetched successfully', products);
  } catch (error) {
    console.error('DEBUG: Error in getProducts:', error.message);
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmerId', 'name location');
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    sendResponse(res, 200, true, 'Product fetched successfully', product);
  } catch (error) {
    console.error('DEBUG: Error in getProductById:', error.message);
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (product.farmerId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this product');
    }

    await product.deleteOne();
    sendResponse(res, 200, true, 'Product deleted successfully');
  } catch (error) {
    console.error('DEBUG: Error in deleteProduct:', error.message);
    next(error);
  }
};
