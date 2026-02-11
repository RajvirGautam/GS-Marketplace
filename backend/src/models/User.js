import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Clerk Integration
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    
    // Authentication
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /@sgsits\.ac\.in$/,
    },
    
    // Profile Info
    fullName: {
      type: String,
      required: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
    },
    branch: {
      type: String,
      required: true,
      enum: ["CS", "IT", "ECE", "EE", "Mech", "Civil"],
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    phone: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    
    // Verification
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    
    // Stats
    totalListings: {
      type: Number,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    
    // Preferences
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    
    // Metadata
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ enrollmentNumber: 1 });
userSchema.index({ clerkUserId: 1 });
userSchema.index({ branch: 1, year: 1 });

export default mongoose.model("User", userSchema);