import express from 'express';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// ==================== PUBLIC ROUTES ====================

// GET all products with filters (ENHANCED SEARCH)
router.get('/', async (req, res) => {
  try {
    const {
      search,
      categories, // Now accepts array
      branches,   // Now accepts array
      years,      // Now accepts array
      conditions, // Now accepts array
      types,      // Now accepts array
      minPrice,
      maxPrice,
      sortBy = 'newest',
      page = 1,
      limit = 24,
      status = 'active'
    } = req.query;

    const filter = { status };

    // ENHANCED SEARCH - Search in title, description, tags, highlights, and specs
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tag: searchRegex },
        { highlights: searchRegex },
        { 'specs.label': searchRegex },
        { 'specs.value': searchRegex }
      ];
    }

    // Handle array filters
    if (categories) {
      const categoryArray = Array.isArray(categories) ? categories : [categories];
      if (categoryArray.length > 0) {
        filter.category = { $in: categoryArray };
      }
    }

    if (branches) {
      const branchArray = Array.isArray(branches) ? branches : [branches];
      if (branchArray.length > 0) {
        filter.branch = { $in: branchArray };
      }
    }

    if (years) {
      const yearArray = Array.isArray(years) ? years : [years];
      if (yearArray.length > 0) {
        filter.year = { $in: yearArray.map(y => parseInt(y)) };
      }
    }

    if (conditions) {
      const conditionArray = Array.isArray(conditions) ? conditions : [conditions];
      if (conditionArray.length > 0) {
        filter.condition = { $in: conditionArray };
      }
    }

    if (types) {
      const typeArray = Array.isArray(types) ? types : [types];
      if (typeArray.length > 0) {
        filter.type = { $in: typeArray };
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Sorting
    let sort = {};
    switch(sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'pricelow':
        sort = { price: 1 };
        break;
      case 'pricehigh':
        sort = { price: -1 };
        break;
      case 'popular':
        sort = { views: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    console.log('🔍 Search filter:', JSON.stringify(filter, null, 2));

    const products = await Product.find(filter)
      .populate({
        path: 'seller',
        select: 'fullName email enrollmentNumber isVerified branch year profilePicture'
      })
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Product.countDocuments(filter);

    console.log('✅ Found', products.length, 'products out of', total, 'total');

    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'seller',
        select: 'fullName email enrollmentNumber isVerified branch year profilePicture'
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// TRACK view (no auth required)
router.post('/:id/view', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PROTECTED ROUTES ====================

// GET user's listings (MUST BE BEFORE /:id route)
router.get('/user/my-listings', authenticate, async (req, res) => {
  try {
    console.log('📊 Fetching listings for user:', req.user._id);

    const products = await Product.find({ seller: req.user._id })
      .populate({
        path: 'seller',
        select: 'fullName email enrollmentNumber isVerified branch year profilePicture'
      })
      .sort({ createdAt: -1 });

    console.log('✅ Found', products.length, 'products');

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('❌ Error fetching user listings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listings',
      error: error.message
    });
  }
});

// GET saved products
router.get('/user/saved', authenticate, async (req, res) => {
  try {
    console.log('💝 Fetching saved products for user:', req.user._id);

    const products = await Product.find({
      savedBy: req.user._id,
      status: 'active'
    })
    .populate({
      path: 'seller',
      select: 'fullName email enrollmentNumber isVerified branch year profilePicture'
    })
    .sort({ createdAt: -1 });

    console.log('✅ Found', products.length, 'saved products');

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('❌ Error fetching saved products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching saved products',
      error: error.message
    });
  }
});

// GET user analytics (calculated on-the-fly)
router.get('/user/analytics', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all user's products
    const products = await Product.find({ seller: userId });

    // Calculate stats
    const totalListings = products.length;
    const activeListings = products.filter(p => p.status === 'active').length;
    const soldListings = products.filter(p => p.status === 'sold').length;
    const pendingListings = products.filter(p => p.status === 'pending').length;
    
    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalSaves = products.reduce((sum, p) => sum + (p.saves || 0), 0);
    
    const totalRevenue = products
      .filter(p => p.status === 'sold')
      .reduce((sum, p) => sum + (p.price || 0), 0);

    res.json({
      success: true,
      analytics: {
        totalListings,
        activeListings,
        soldListings,
        pendingListings,
        totalViews,
        totalSaves,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
});

// CREATE new product
router.post('/', authenticate, upload.array('images', 5), async (req, res) => {
  try {
    console.log('📝 Creating product...');
    console.log('Body:', req.body);
    console.log('Files:', req.files?.length || 0);

    const {
      title,
      description,
      price,
      type,
      barterFor,
      category,
      condition,
      location,
      tag,
      highlights,
      specs,
      branch,
      year,
    } = req.body;

    // Validation
    if (!title || !description || !category || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, and condition are required'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    // Upload images to Cloudinary
    console.log('📤 Uploading images to Cloudinary...');
    const imageUrls = [];
    
    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'sgsits-marketplace',
            resource_type: 'image',
            transformation: [
              { width: 1000, height: 1000, crop: 'limit' },
              { quality: 'auto', fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
      
      imageUrls.push(result.secure_url);
    }

    console.log('✅ Images uploaded:', imageUrls.length);

    // Parse highlights and specs if they're strings
    let parsedHighlights = [];
    let parsedSpecs = [];

    if (highlights) {
      parsedHighlights = typeof highlights === 'string' 
        ? JSON.parse(highlights) 
        : highlights;
    }

    if (specs) {
      parsedSpecs = typeof specs === 'string' 
        ? JSON.parse(specs) 
        : specs;
    }

    // Create product
    const product = await Product.create({
      title,
      description,
      price: type === 'free' ? 0 : parseFloat(price),
      type,
      barterFor,
      category,
      condition,
      location: location || 'SGSITS Campus',
      tag: tag || 'FOR SALE',
      images: imageUrls,
      seller: req.user._id,
      branch: branch,
      year: parseInt(year),
      highlights: parsedHighlights,
      specs: parsedSpecs
    });

    console.log('✅ Product created:', product._id);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// UPDATE product
router.put('/:id', authenticate, async (req, res) => {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 UPDATE REQUEST');
    console.log('Product ID:', req.params.id);
    console.log('User ID:', req.user?._id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Find product WITHOUT populate to avoid issues
    const product = await Product.findById(req.params.id);

    if (!product) {
      console.log('❌ Product not found');
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.log('✅ Product found');
    console.log('Seller (raw):', product.seller);
    console.log('User (raw):', req.user._id);

    // ✅ FIX: Extract _id if seller is populated, otherwise use as-is
    const sellerId = (product.seller._id || product.seller).toString();
    const userId = req.user._id.toString();

    console.log('Seller ID (extracted):', sellerId);
    console.log('User ID (extracted):', userId);
    console.log('Match:', sellerId === userId);

    if (sellerId !== userId) {
      console.log('❌ Not authorized');
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    console.log('✅ Authorized, updating...');

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: 'seller',
      select: 'fullName email enrollmentNumber isVerified branch year profilePicture'
    });

    console.log('✅ Product updated!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERROR IN UPDATE ROUTE:');
    console.error('Error message:', error.message);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// DELETE product
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    // Delete images from Cloudinary
    for (const imageUrl of product.images) {
      try {
        const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    console.log('✅ Product deleted:', req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

// SAVE/UNSAVE product (TOGGLE)
router.post('/:id/save', authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const isSaved = product.savedBy.includes(req.user._id);

    if (isSaved) {
      // Unsave
      product.savedBy = product.savedBy.filter(
        id => id.toString() !== req.user._id.toString()
      );
      product.saves = Math.max(0, product.saves - 1);
    } else {
      // Save
      product.savedBy.push(req.user._id);
      product.saves += 1;
    }

    await product.save();

    console.log(isSaved ? '💔 Product unsaved' : '💝 Product saved');

    res.json({
      success: true,
      message: isSaved ? 'Product unsaved' : 'Product saved',
      saved: !isSaved
    });
  } catch (error) {
    console.error('Error toggling save:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving product',
      error: error.message
    });
  }
});

export default router;