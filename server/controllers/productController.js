import Product from '../models/Product.js';
import User from '../models/User.js';
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

    // Fetch the farmer profile to get the state and pincode
    const farmerProfile = await User.findById(req.user.id);
    if (!farmerProfile) {
      return res.status(404).json({ success: false, message: "Farmer profile not found" });
    }

    // Owner ID comes from the authenticated user — never from frontend input
    const product = new Product({
      owner: req.user.id,
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
      season: req.body.season || "all_season",
      farmerState: farmerProfile.state || "Not specified",
      farmerPincode: farmerProfile.pincode || "Not specified",
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
    const { owner } = req.query;

    const filter = owner ? { owner } : {};

    const products = await Product.find(filter).populate('owner', FARMER_POPULATE_FIELDS);
    sendResponse(res, 200, true, 'Products fetched successfully', products);
  } catch (error) {
    console.error('Error in getProducts:', error.message);
    next(error);
  }
};

export const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ owner: req.user.id }).populate('owner', FARMER_POPULATE_FIELDS);
    sendResponse(res, 200, true, 'My products fetched successfully', products);
  } catch (error) {
    console.error('Error in getMyProducts:', error.message);
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('owner', FARMER_POPULATE_FIELDS);
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

    if (product.owner.toString() !== req.user.id.toString()) {
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

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (product.owner.toString() !== req.user.id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this product');
    }

    // Fetch the farmer profile to get the latest state and pincode
    const farmerProfile = await User.findById(req.user.id);

    // Handle tags
    let tags = product.tags;
    if (req.body.tags) {
      try {
        tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
      } catch (e) {
        // If parsing fails, use array wrapper or keep existing
        tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];
      }
    }

    // Handle images
    let imageUrls = product.images;
    
    // If new files are uploaded, they REPLACE the old ones completely according to instructions
    // "Image upload should replace old images and store new image URLs"
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path || file.secure_url || file.url);
    } else if (req.body.existingImages) {
       // Support retaining existing images if no new files are uploaded
       try {
           imageUrls = typeof req.body.existingImages === 'string' 
             ? JSON.parse(req.body.existingImages) 
             : req.body.existingImages;
       } catch (e) {
           imageUrls = [req.body.existingImages];
       }
    }

    // Update scalar fields
    product.title = req.body.title || product.title;
    product.price = req.body.price ? Number(req.body.price) : product.price;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
    product.description = req.body.description !== undefined ? req.body.description : product.description;
    product.season = req.body.season !== undefined ? req.body.season : product.season;
    product.farmerState = farmerProfile ? farmerProfile.state : product.farmerState;
    product.farmerPincode = farmerProfile ? farmerProfile.pincode : product.farmerPincode;
    product.tags = Array.isArray(tags) ? tags : [];
    
    if (req.body.isVisible !== undefined) {
      product.isVisible = req.body.isVisible === "true" || req.body.isVisible === true;
    }

    product.images = imageUrls;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error in updateProduct:', error.message);
    next(error);
  }
};
