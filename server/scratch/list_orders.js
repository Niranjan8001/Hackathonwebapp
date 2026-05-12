import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

const MONGO_URI = process.env.MONGO_URI;

const listOrders = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
    const orders = await Order.find().limit(5);
    console.log('Recent Orders:', orders.map(o => o._id));
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

listOrders();
