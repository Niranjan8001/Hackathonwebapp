import Order from '../models/Order.js';
import Product from '../models/Product.js';
import sendResponse from '../utils/response.js';

export const createOrder = async (req, res, next) => {
  try {
    const { farmer, products, totalAmount } = req.body;

    const order = await Order.create({
      buyer: req.userId,
      farmer,
      products,
      totalAmount,
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
      query.farmer = req.userId;
    } else {
      query.buyer = req.userId;
    }

    const orders = await Order.find(query)
      .populate('farmer', 'name')
      .populate('buyer', 'name email')
      .populate('products.productId', 'title images');

    sendResponse(res, 200, true, 'Orders fetched successfully', orders);
  } catch (error) {
    console.error('DEBUG: Error in getOrders:', error.message);
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [{ buyer: req.userId }, { farmer: req.userId }]
    })
    .populate('farmer', 'name')
    .populate('buyer', 'name email')
    .populate('products.productId', 'title images');

    sendResponse(res, 200, true, 'My orders fetched successfully', orders);
  } catch (error) {
    console.error('DEBUG: Error in getMyOrders:', error.message);
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

    if (order.farmer.toString() !== req.userId.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this order');
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // If order is accepted (changed from Pending to Processing)
    if (oldStatus === 'pending' || oldStatus === 'Pending') {
      if (status === 'Processing') {
        for (const item of order.products) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { 
              stock: -item.quantity, 
              sold: item.quantity 
            }
          });
        }
      }
    }

    sendResponse(res, 200, true, 'Order status updated successfully', order);
  } catch (error) {
    console.error('DEBUG: Error in updateOrderStatus:', error.message);
    next(error);
  }
};
