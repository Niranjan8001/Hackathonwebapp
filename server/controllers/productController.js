import Product from '../models/Product.js';
import sendResponse from '../utils/response.js';

export const createProduct = async (req, res, next) => {
  try {
    const { name, title, price, category, stock, quantity } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    console.log('Creating product with data:', req.body);
    console.log('User from token:', req.user);

    if (req.user?.isDemoUser) {
      return sendResponse(res, 201, true, 'Product created successfully (DEMO)', {
        _id: `demo_${Date.now()}`,
        farmerId: req.user._id,
        title: title || name,
        price: Number(price),
        category,
        stock: Number(stock || quantity || 0),
        images,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    const product = await Product.create({
      farmerId: req.user._id,
      title: title || name,
      price: Number(price),
      category,
      stock: Number(stock || quantity || 0),
      images,
    });

    console.log('Product created successfully:', product);
    sendResponse(res, 201, true, 'Product created successfully', product);
  } catch (error) {
    console.error('Error in createProduct:', error);
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { farmerId } = req.query;

    if (req.user?.isDemoUser) {
      return sendResponse(res, 200, true, 'Demo mode active - fetching from frontend', []);
    }

    const filter = farmerId ? { farmerId } : {};
    
    const products = await Product.find(filter).populate('farmerId', 'name location');
    sendResponse(res, 200, true, 'Products fetched successfully', products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    if (req.user?.isDemoUser) {
      res.status(404);
      throw new Error('Product not found (DEMO)');
    }

    const product = await Product.findById(req.params.id).populate('farmerId', 'name location');
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    sendResponse(res, 200, true, 'Product fetched successfully', product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    if (req.user?.isDemoUser) {
      return sendResponse(res, 200, true, 'Product deleted successfully (DEMO)');
    }

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
    next(error);
  }
};
