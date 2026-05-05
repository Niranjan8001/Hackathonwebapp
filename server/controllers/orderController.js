import Order from '../models/Order.js';
import sendResponse from '../utils/response.js';

export const createOrder = async (req, res, next) => {
  try {
    const { farmerId, products, totalAmount } = req.body;

    if (req.user?.isDemoUser) {
      return sendResponse(res, 201, true, 'Order created successfully (DEMO)', {
        _id: `demo_${Date.now()}`,
        buyerId: req.user._id,
        farmerId,
        products,
        totalAmount,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    const order = await Order.create({
      buyerId: req.user._id,
      farmerId,
      products,
      totalAmount,
    });

    sendResponse(res, 201, true, 'Order created successfully', order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    if (req.user?.isDemoUser) {
      return sendResponse(res, 200, true, 'Demo mode active - fetching from frontend', []);
    }

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
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (req.user?.isDemoUser) {
      return sendResponse(res, 200, true, 'Order status updated successfully (DEMO)', { status });
    }

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
    next(error);
  }
};
