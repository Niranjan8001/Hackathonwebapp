import Order from '../models/Order.js';
import sendResponse from '../utils/response.js';

export const getEarningsReportData = async (req, res, next) => {
  try {
    // Fetch all orders where the user is the farmer
    // Including 'delivered' and other statuses for a full report
    const orders = await Order.find({ farmer: req.user._id })
      .populate('buyer', 'name email')
      .populate('products.productId', 'title price')
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return sendResponse(res, 200, true, 'No earnings data found', {
        orders: [],
        summary: {
          totalOrders: 0,
          totalEarnings: 0,
          pendingEarnings: 0,
          withdrawnEarnings: 0 // Mocked for now as we don't have withdrawal system
        }
      });
    }

    // Process data for the report
    let totalEarnings = 0;
    let pendingEarnings = 0;

    const formattedOrders = orders.map(order => {
      const amount = order.totalAmount || 0;
      const isDelivered = order.status.toLowerCase() === 'delivered';
      
      if (isDelivered) {
        totalEarnings += amount;
      } else if (['pending', 'accepted', 'shipped'].includes(order.status.toLowerCase())) {
        pendingEarnings += amount;
      }

      // Calculate commission (e.g., 5%)
      const commission = amount * 0.05;
      const deliveryCharges = order.deliveryFee || 0;

      return {
        orderId: order._id,
        date: order.createdAt,
        buyer: order.buyer ? order.buyer.name : 'Unknown',
        products: order.products.map(p => ({
          name: p.productId ? p.productId.title : 'Deleted Product',
          qty: p.qty,
          price: p.price
        })),
        status: order.status,
        amount: amount,
        commission: commission,
        deliveryCharges: deliveryCharges,
        netEarnings: isDelivered ? (amount - commission) : 0
      };
    });

    sendResponse(res, 200, true, 'Earnings data fetched successfully', {
      orders: formattedOrders,
      summary: {
        totalOrders: orders.length,
        totalEarnings: totalEarnings,
        pendingEarnings: pendingEarnings,
        withdrawnEarnings: 0 // Mocked
      }
    });

  } catch (error) {
    console.error('Error in getEarningsReportData:', error.message);
    next(error);
  }
};
