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

  // Phone number is stored per-farm in the farm profile, not on the user.

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

  // 🔥 FARM PROFILE FIELDS
  farmName: {
    type: String,
  },

  farmPhone: {
    type: String,
    unique: true,
    sparse: true, 
  },

  farmSize: {
    type: String,
  },

  farmUnit: {
    type: String,
  },

  ownershipType: {
    type: String,
  },

  primaryCrops: {
    type: [String],
    default: [],
  },

  otherCrops: {
    type: [String],
    default: [],
  },

  irrigationSource: {
    type: String,
  },

  waterAvailability: {
    type: String,
  },

  villageLocality: {
    type: String,
  },

  district: {
    type: String,
  },

  state: {
    type: String,
  },

  pincode: {
    type: String,
  },

  additionalNotes: {
    type: String,
  },

  farmImages: {
    type: [String],
    default: [],
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
  accountHolderName: String,
  accountNumber: String,
  ifscCode: String,
  bankName: String,
  accountType: String,
  branchName: String,

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
      enum: ['Not Eligible', 'Ready for Verification', 'Verification Requested', 'Verified'], 
      default: 'Not Eligible' 
    },
    oauthState: String,
    codeVerifier: String
  },

}, { timestamps: true });

const User =
  mongoose.models.User ||
  mongoose.model('User', userSchema, 'Farmer');

console.log(`[MODEL INIT] User model initialized. Collection: ${User.collection.name}, Database: ${mongoose.connection.name}`);

// 🔧 Drop legacy `phone_1` index if it exists (one-time migration)
User.collection.dropIndex('phone_1').then(() => {
  console.log('✅ Dropped legacy phone_1 index from users collection');
}).catch((err) => {
  if (err.codeName === 'IndexNotFound' || err.code === 27) {
    console.log('ℹ️  No legacy phone_1 index found — nothing to drop');
  } else {
    console.error('⚠️  Error dropping phone_1 index:', err.message);
  }
});

export default User;