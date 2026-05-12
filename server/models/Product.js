import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    alias: 'farmer'
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  sold: {
    type: Number,
    required: true,
    default: 0,
  },
  views: {
    type: Number,
    required: true,
    default: 0,
  },
  description: String,
  grade: String,
  harvestDate: Date,
  storageInstructions: String,
  season: {
    type: String,
    enum: ['summer', 'winter', 'monsoon', 'spring', 'autumn', 'all_season'],
    default: 'all_season'
  },
  farmerState: String,
  farmerPincode: String,
  tags: [String],
  isVisible: {
    type: Boolean,
    default: true
  },
  deliveryType: {
    type: String,
    enum: ['Home Delivery', 'Self Pickup'],
    default: 'Home Delivery'
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  deliveryTime: String,
  images: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
