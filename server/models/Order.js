import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: String, // Changed to String to match actual DB data
    ref: 'User',
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  customerDetails: {
    fullName: String,
    phoneNumber: String,
    pincode: String,
    address: String,
    state: String,
    district: String,
    notes: String,
  },
  items: [{
    productId: {
      type: String, // Changed to String to match actual DB data
      ref: 'Product',
      required: true,
    },
    farmerId: {
      type: String, // Changed to String to match actual DB data
      ref: 'User',
      required: true,
    },
    name: String,
    quantity: Number,
    price: Number,
    totalPrice: Number,
  }],
  summary: {
    subtotal: Number,
    deliveryFee: Number,
    total: Number,
  },
  status: {
    type: String,
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    default: 'pending',
  },
  placedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// For backward compatibility and easier querying
orderSchema.index({ "items.farmerId": 1 });
orderSchema.index({ userId: 1 });

export default mongoose.model('Order', orderSchema);
