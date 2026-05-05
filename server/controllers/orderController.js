import Order from '../models/Order.js';
import { isMockMode } from '../config/mockConfig.js';
import { mockOrders } from '../mock/mockOrders.js';
import sendResponse from '../utils/response.js';

export const createOrder = async (req, res, next) => {
  try {
    const { farmerId, products, totalAmount } = req.body;

    if (isMockMode()) {
      const order = {
        _id: `order_${Date.now()}`,
        buyerId: req.user._id,
        farmerId,
        products,
        totalAmount,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockOrders.push(order);
      return sendResponse(res, 201, true, 'Order created successfully (MOCK)', order);
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
    if (isMockMode()) {
      let query = {};
      if (req.user.role === 'farmer') {
        query.farmerId = req.user._id;
      } else {
        query.buyerId = req.user._id;
      }

      const filtered = mockOrders.filter(o => 
        (query.farmerId && o.farmerId === query.farmerId) || 
        (query.buyerId && o.buyerId === query.buyerId)
      );

      // Populate-like behavior
      const populated = filtered.map(o => ({
        ...o,
        farmerId: { name: "Demo Farmer" },
        buyerId: { name: "John Doe", phone: "0987654321" },
        products: o.products.map(p => ({
          ...p,
          productId: { title: "Mock Product", images: ["https://images.unsplash.com/photo-1546473422-292c7b913c52?auto=format&fit=crop&q=80&w=400"] }
        }))
      }));

      return sendResponse(res, 200, true, 'Orders fetched successfully (MOCK)', populated);
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
    if (isMockMode()) {
      const order = mockOrders.find(o => o._id === req.params.id);
      if (!order) {
        res.status(404);
        throw new Error('Order not found (MOCK)');
      }
      if (order.farmerId !== req.user._id) {
        res.status(403);
        throw new Error('Not authorized to update this order (MOCK)');
      }
      order.status = status;
      order.updatedAt = new Date().toISOString();
      return sendResponse(res, 200, true, 'Order status updated successfully (MOCK)', order);
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
