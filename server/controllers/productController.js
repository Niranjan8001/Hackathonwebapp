import Product from '../models/Product.js';
import sendResponse from '../utils/response.js';

export const createProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    // 1. Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded. At least one image is required."
      });
    }

    const imageUrls = req.files.map(file => file.path);

    // 2. Parse complex fields from FormData
    let tags = [];
    if (req.body.tags) {
      try {
        tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
      } catch (e) {
        console.warn("Failed to parse tags:", req.body.tags);
      }
    }

    // 3. Create product with correct types and owner
    const product = new Product({
      ...req.body,
      owner: req.userId, // Crucial: Set the owner from the verified token
      price: Number(req.body.price) || 0,
      stock: Number(req.body.stock) || Number(req.body.quantity) || 0,
      deliveryFee: Number(req.body.deliveryFee) || 0,
      tags: Array.isArray(tags) ? tags : [],
      images: imageUrls,
      isVisible: req.body.isVisible === 'true' || req.body.isVisible === true,
      harvestDate: req.body.harvestDate ? new Date(req.body.harvestDate) : undefined
    });

    await product.save();

    console.log("Product saved successfully:", product._id);
    res.status(201).json({
      success: true,
      message: "Product listed successfully!",
      product,
    });

  } catch (err) {
    console.error("Product Creation Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "An internal server error occurred while creating the product.",
    });
  }
};
export const getProducts = async (req, res, next) => {
  try {
    const { owner } = req.query;

    const filter = owner ? { owner } : {};
    
    const products = await Product.find(filter).populate('owner', 'name locationText');
    sendResponse(res, 200, true, 'Products fetched successfully', products);
  } catch (error) {
    console.error('DEBUG: Error in getProducts:', error.message);
    next(error);
  }
};

export const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ owner: req.userId });
    sendResponse(res, 200, true, 'My products fetched successfully', products);
  } catch (error) {
    console.error('DEBUG: Error in getMyProducts:', error.message);
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('owner', 'name locationText');
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

    if (product.owner.toString() !== req.userId.toString()) {
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
