import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
      type: Number,
      required: function() {
        return this.type === 'sale' || this.type === 'rent';
      }
    },
    type: {
      type: String,
      enum: ['sale', 'barter', 'rent', 'free'],
      required: true,
      default: 'sale'
    },
    barterFor: String,
    category: {
      type: String,
      required: true,
      enum: ['books', 'lab', 'stationery', 'electronics', 'hostel', 'misc', 'tools']
    },
    tag: {
      type: String,
      default: 'FOR SALE'
    },
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Like New', 'Good', 'Acceptable']
    },
    images: [{
      type: String,
      required: true
    }],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    location: {
      type: String,
      default: 'SGSITS Campus'
    },
    views: {
      type: Number,
      default: 0
    },
    saves: {
      type: Number,
      default: 0
    },
    savedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    status: {
      type: String,
      enum: ['active', 'sold', 'pending'],
      default: 'active'
    },
    isTrending: {
      type: Boolean,
      default: false
    },
    branch: {
      type: String,
      enum: ['cs', 'it', 'ece', 'ee', 'mech', 'civil'],
      required: true
    },
    year: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true
    },
    highlights: [String],
    specs: [{
      label: String,
      value: String
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for faster searches
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ seller: 1, status: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for calculating "time ago"
productSchema.virtual('postedDate').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
});

// Populate seller info when querying - FIXED
productSchema.pre(/^find/, function() {
  this.populate({
    path: 'seller',
    select: 'fullName email enrollmentNumber isVerified branch year profilePicture'
  });
});



const Product = mongoose.model('Product', productSchema);

export default Product;