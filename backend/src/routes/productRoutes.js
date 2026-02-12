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

// GET all products with filters
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      branch,
      year,
      condition,
      type,
      minPrice,
      maxPrice,
      sortBy = 'newest',
      page = 1,
      limit = 24,
      status = 'active'
    } = req.query;

    const filter = { status };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tag: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) filter.category = category;
    if (branch) filter.branch = branch;
    if (year) filter.year = parseInt(year);
    if (condition) filter.condition = condition;
    if (type) filter.type = type;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

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

    // ✅ ADDED .populate('seller')
    const products = await Product.find(filter)
      .populate({
        path: 'seller',
        select: 'fullName email enrollmentNumber isVerified branch year profilePicture'
      })
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Product.countDocuments(filter);

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
    // ✅ ADDED .populate('seller')
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
        message: 'Not authorized to update this product'
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: 'seller',
      select: 'fullName email enrollmentNumber isVerified branch year profilePicture'
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
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
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`sgsits-marketplace/${publicId}`);
    }

    await Product.findByIdAndDelete(req.params.id);

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

// GET user's listings
router.get('/user/my-listings', authenticate, async (req, res) => {
  try {
    // ✅ ADDED .populate('seller')
    const products = await Product.find({ seller: req.user._id })
      .populate({
        path: 'seller',
        select: 'fullName email enrollmentNumber isVerified branch year profilePicture'
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listings',
      error: error.message
    });
  }
});

// SAVE/UNSAVE product
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
      product.savedBy = product.savedBy.filter(
        id => id.toString() !== req.user._id.toString()
      );
      product.saves = Math.max(0, product.saves - 1);
    } else {
      product.savedBy.push(req.user._id);
      product.saves += 1;
    }

    await product.save();

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

// GET saved products
router.get('/user/saved', authenticate, async (req, res) => {
  try {
    // ✅ ADDED .populate('seller')
    const products = await Product.find({
      savedBy: req.user._id,
      status: 'active'
    })
    .populate({
      path: 'seller',
      select: 'fullName email enrollmentNumber isVerified branch year profilePicture'
    })
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error fetching saved products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching saved products',
      error: error.message
    });
  }
});

export default router;