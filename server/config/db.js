import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    })
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📂 Active Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Database Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
