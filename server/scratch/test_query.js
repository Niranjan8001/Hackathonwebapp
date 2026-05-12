import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';

dotenv.config();

const testQuery = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const farmerId = "6a01d417c669364b67d0dfed";
    console.log(`Testing query for farmerId: ${farmerId}`);
    
    // Test with string
    const ordersStr = await Order.find({ "items.farmerId": farmerId });
    console.log(`Found with string ID: ${ordersStr.length}`);
    
    // Test with ObjectId
    const ordersObj = await Order.find({ "items.farmerId": new mongoose.Types.ObjectId(farmerId) });
    console.log(`Found with ObjectId: ${ordersObj.length}`);
    
    if (ordersStr.length > 0) {
        console.log('First order status:', ordersStr[0].status);
        console.log('First order items farmerIds:', ordersStr[0].items.map(i => i.farmerId.toString()));
    }

    // Also check the other farmer ID I saw
    const farmerId2 = "6a033fb0a569b6142a4abb06";
    const orders2 = await Order.find({ "items.farmerId": farmerId2 });
    console.log(`Found for farmerId ${farmerId2}: ${orders2.length}`);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

testQuery();
