import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  unit: {
    type: String,
    default: 'kg'
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  minOrderQuantity: {
    type: Number,
    default: 1
  },
  sku: {
    type: String
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
  shortDescription: String,
  description: String,
  grade: String,
  harvestDate: Date,
  storageInstructions: String,
  season: {
    type: String,
    enum: ['Summer', 'Monsoon', 'Winter', 'All Season'],
    default: 'All Season'
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
