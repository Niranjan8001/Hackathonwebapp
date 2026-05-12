import Order from '../models/Order.js';
import Product from '../models/Product.js';
import sendResponse from '../utils/response.js';

export const createOrder = async (req, res, next) => {
  try {
    const { items, summary, customerDetails, userEmail } = req.body;

    const order = await Order.create({
      userId: req.userId,
      userEmail,
      customerDetails,
      items,
      summary,
    });

    sendResponse(res, 201, true, 'Order created successfully', order);
  } catch (error) {
    console.error('DEBUG: Error in createOrder:', error.message);
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'farmer') {
      query["items.farmerId"] = req.userId;
    } else {
      query.userId = req.userId;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('items.productId', 'title images')
      .populate('items.farmerId', 'name');

    sendResponse(res, 200, true, 'Orders fetched successfully', orders);
  } catch (error) {
    console.error('DEBUG: Error in getOrders:', error.message);
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [
        { userId: req.userId }, 
        { "items.farmerId": req.userId }
      ]
    })
    .populate('userId', 'name email')
    .populate('items.productId', 'title images')
    .populate('items.farmerId', 'name');

    sendResponse(res, 200, true, 'My orders fetched successfully', orders);
  } catch (error) {
    console.error('DEBUG: Error in getMyOrders:', error.message);
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'title images description')
      .populate('items.farmerId', 'name farmName phone');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    sendResponse(res, 200, true, 'Order fetched successfully', order);
  } catch (error) {
    console.error('DEBUG: Error in getOrderById:', error.message);
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Check if the farmer is authorized (at least one item belongs to them)
    const isAuthorized = order.items.some(item => item.farmerId.toString() === req.userId.toString());
    
    if (!isAuthorized && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this order');
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // If order is accepted (changed to Processing/Accepted)
    if (oldStatus.toLowerCase() === 'pending' && status.toLowerCase() === 'processing') {
      for (const item of order.items) {
        // Only update stock for products belonging to THIS farmer if they are the one updating?
        // Actually, usually the whole order moves status.
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { 
            stock: -item.quantity, 
            sold: item.quantity 
          }
        });
      }
    }

    sendResponse(res, 200, true, 'Order status updated successfully', order);
  } catch (error) {
    console.error('DEBUG: Error in updateOrderStatus:', error.message);
    next(error);
  }
};
