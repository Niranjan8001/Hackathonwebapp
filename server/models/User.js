import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: false,
  },

  // 🔥 NEW FIELDS (IMPORTANT)
  farmName: {
    type: String,
  },

  locationText: {
    type: String,
  },

  scale: {
    type: String,
  },

  crops: {
    type: [String],
  },

  organic: {
    type: Boolean,
  },

  // existing
  isDemoUser: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
    enum: ['farmer', 'buyer'],
    default: 'farmer',
  },

}, { timestamps: true });

export default mongoose.model('User', userSchema);