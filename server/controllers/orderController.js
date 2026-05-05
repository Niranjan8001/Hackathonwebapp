import Order from '../models/Order.js';
import sendResponse from '../utils/response.js';

export const createOrder = async (req, res, next) => {
  try {
    const { farmerId, products, totalAmount } = req.body;

    const order = await Order.create({
      buyerId: req.user._id,
      farmerId,
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
      query.farmerId = req.user._id;
    } else {
      query.buyerId = req.user._id;
    }

    const orders = await Order.find(query)
      .populate('farmerId', 'name')
      .populate('buyerId', 'name phone')
      .populate('products.productId', 'title images');

    sendResponse(res, 200, true, 'Orders fetched successfully', orders);
  } catch (error) {
    console.error('DEBUG: Error in getOrders:', error.message);
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

    if (order.farmerId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this order');
    }

    order.status = status;
    await order.save();

    sendResponse(res, 200, true, 'Order status updated successfully', order);
  } catch (error) {
    console.error('DEBUG: Error in updateOrderStatus:', error.message);
    next(error);
  }
};
