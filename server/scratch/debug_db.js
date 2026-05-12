import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const debugDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const collection = mongoose.connection.db.collection('orders');
    const orders = await collection.find({}).toArray();
    console.log(`Total orders found via native driver: ${orders.length}`);
    
    if (orders.length > 0) {
        const firstOrder = orders[0];
        console.log('First order items structure:');
        firstOrder.items.forEach((item, idx) => {
            console.log(`Item ${idx} farmerId:`, item.farmerId, 'Type:', typeof item.farmerId);
        });
        
        const farmerIdToSearch = firstOrder.items[0].farmerId;
        console.log(`Searching for farmerId: ${farmerIdToSearch} (Type: ${typeof farmerIdToSearch})`);
        
        const found = await collection.find({ "items.farmerId": farmerIdToSearch }).toArray();
        console.log(`Native query found: ${found.length}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

debugDB();
