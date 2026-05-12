import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

const MONGO_URI = process.env.MONGO_URI;

const checkOrder = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
    const orderId = '6a035864eb5dadcb86a24135';
    const order = await Order.findById(orderId);
    
    if (order) {
      console.log('Order found:', order);
    } else {
      console.log('Order not found');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkOrder();
