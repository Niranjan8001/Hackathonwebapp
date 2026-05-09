import Product from '../models/Product.js';
import sendResponse from '../utils/response.js';

const FARMER_POPULATE_FIELDS = 'name profilePhoto phone locationText';

export const createProduct = async (req, res) => {
  try {
    // 1. Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded. At least one image is required."
      });
    }

    const imageUrls = req.files.map(file =>
      file.path || file.secure_url || file.url
    );

    // 2. Parse complex fields from FormData
    let tags = [];
    if (req.body.tags) {
      try {
        tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
      } catch (e) {
        // If tags can't be parsed, keep as empty array
      }
    }

    // Farmer ID comes from the authenticated user — never from frontend input
    const product = new Product({
      farmer: req.user.id,
      title: req.body.title,
      price: Number(req.body.price),
      category: req.body.category,
      stock: Number(req.body.stock),
      sold: 0,
      views: 0,
      description: req.body.description || "",
      grade: req.body.grade || "Grade A",
      harvestDate: req.body.harvestDate
        ? new Date(req.body.harvestDate)
        : null,
      storageInstructions: req.body.storageInstructions || "",
      tags: Array.isArray(tags) ? tags : [],
      isVisible: req.body.isVisible === "true",
      deliveryType: req.body.deliveryType || "Home Delivery",
      deliveryFee: Number(req.body.deliveryFee) || 0,
      deliveryTime: req.body.deliveryTime || "2-3 Days",
      images: imageUrls,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product listed successfully!",
      product,
    });

  } catch (err) {
    console.error(`[createProduct] Error: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { farmer } = req.query;

    const filter = farmer ? { farmer } : {};

    const products = await Product.find(filter).populate('farmer', FARMER_POPULATE_FIELDS);
    sendResponse(res, 200, true, 'Products fetched successfully', products);
  } catch (error) {
    console.error('Error in getProducts:', error.message);
    next(error);
  }
};

export const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ farmer: req.user.id }).populate('farmer', FARMER_POPULATE_FIELDS);
    sendResponse(res, 200, true, 'My products fetched successfully', products);
  } catch (error) {
    console.error('Error in getMyProducts:', error.message);
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer', FARMER_POPULATE_FIELDS);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    sendResponse(res, 200, true, 'Product fetched successfully', product);
  } catch (error) {
    console.error('Error in getProductById:', error.message);
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

    if (product.farmer.toString() !== req.user.id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this product');
    }

    await product.deleteOne();
    sendResponse(res, 200, true, 'Product deleted successfully');
  } catch (error) {
    console.error('Error in deleteProduct:', error.message);
    next(error);
  }
};
