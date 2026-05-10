import mongoose from 'mongoose';
import Category from './models/Category.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const categories = [
      { name: 'Fruits' },
      { name: 'Vegetables' },
      { name: 'Grains and Pulses' },
      { name: 'Commercial crops' },
      { name: 'Dairy' },

      { name: 'Spices' }
    ];

    await Category.deleteMany();
    await Category.insertMany(categories);
    
    console.log('Categories seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedCategories();
