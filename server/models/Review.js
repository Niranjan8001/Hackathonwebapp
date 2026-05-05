import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'replied'],
    default: 'pending'
  },
  reply: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Review', ReviewSchema);
