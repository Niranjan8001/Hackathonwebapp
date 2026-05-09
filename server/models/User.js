import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  phone: {
    type: String,
  },

  dob: {
    type: String,
  },

  gender: {
    type: String,
  },

  language: {
    type: String,
    default: 'English',
  },

  password: {
    type: String,
    required: true,
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

  profilePhoto: {
    type: String,
  },

  bannerImage: {
    type: String,
  },

  bio: {
    type: String,
  },

  certifications: [{
    title: String,
    issuer: String,
    file: String,
    id: Number
  }],

  role: {
    type: String,
    enum: ['farmer', 'buyer'],
    default: 'farmer',
  },

  // Bank Details
  bankName: String,
  accountHolder: String,
  accountNumber: String,
  ifscCode: String,

  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },

  verification: {
    digilockerLinked: { type: Boolean, default: false },
    digilockerId: String,
    verifiedAt: Date,
    verificationStatus: { 
      type: String, 
      enum: ['none', 'pending', 'verified', 'failed'], 
      default: 'none' 
    },
    oauthState: String,
    codeVerifier: String
  },

}, { timestamps: true });

export default mongoose.model('User', userSchema);