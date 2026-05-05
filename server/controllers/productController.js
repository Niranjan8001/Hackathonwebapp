import Product from '../models/Product.js';
import { isMockMode } from '../config/mockConfig.js';
import { mockProducts } from '../mock/mockProducts.js';
import sendResponse from '../utils/response.js';

export const createProduct = async (req, res, next) => {
  try {
    const { name, title, price, category, stock, quantity } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    console.log('Creating product with data:', req.body);
    console.log('User from token:', req.user);

    if (isMockMode()) {
      const product = {
        _id: `prod_${Date.now()}`,
        farmerId: req.user._id,
        title: title || name,
        price: Number(price),
        category,
        stock: Number(stock || quantity || 0),
        images,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockProducts.push(product);
      console.log('Mock product created successfully:', product);
      return sendResponse(res, 201, true, 'Product created successfully (MOCK)', product);
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

    if (isMockMode()) {
      let filtered = [...mockProducts];
      if (farmerId) {
        filtered = filtered.filter(p => p.farmerId === farmerId);
      }
      // Populate-like behavior
      const populated = filtered.map(p => ({
        ...p,
        farmerId: { name: "Demo Farmer", location: "Bangalore" }
      }));
      return sendResponse(res, 200, true, 'Products fetched successfully (MOCK)', populated);
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
    if (isMockMode()) {
      const product = mockProducts.find(p => p._id === req.params.id);
      if (!product) {
        res.status(404);
        throw new Error('Product not found (MOCK)');
      }
      const populated = {
        ...product,
        farmerId: { name: "Demo Farmer", location: "Bangalore" }
      };
      return sendResponse(res, 200, true, 'Product fetched successfully (MOCK)', populated);
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
    if (isMockMode()) {
      const index = mockProducts.findIndex(p => p._id === req.params.id);
      if (index === -1) {
        res.status(404);
        throw new Error('Product not found (MOCK)');
      }
      if (mockProducts[index].farmerId !== req.user._id) {
        res.status(403);
        throw new Error('Not authorized to delete this product (MOCK)');
      }
      mockProducts.splice(index, 1);
      return sendResponse(res, 200, true, 'Product deleted successfully (MOCK)');
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
