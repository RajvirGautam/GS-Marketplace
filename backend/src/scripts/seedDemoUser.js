/**
 * Demo User Seed Script
 * Run: node backend/src/scripts/seedDemoUser.js
 *
 * Creates a fully-loaded demo user with:
 *  - 2 active product listings
 *  - 1 sold product (past deal as seller)
 *  - 1 bought product (past deal as buyer)
 *  - 2 saved products
 *  - 3 incoming offers on listings
 *  - 4 conversations with fake chat history
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/User.js';
import Product from '../models/Product.js';
import Offer from '../models/Offer.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Deal from '../models/Deal.js';

// ─── Helper ───────────────────────────────────────────────────────────────────
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

// ─── Seed Users ───────────────────────────────────────────────────────────────
const DEMO_EMAIL = 'demo@campusmarket.com';

const otherUsersData = [
  {
    email: 'riya.joshi.demo@campusmarket.com',
    fullName: 'Riya Joshi',
    enrollmentNumber: '0801EC221032',
    branch: 'ece',
    year: 2,
    phone: '9812345601',
    profilePicture: 'https://res.cloudinary.com/rajvirgautam/image/upload/v1774382316/6yOrAQ8N-800-800_bsjtax.webp',
    rating: 4.7,
    reviewCount: 6,
    totalSales: 7
  },
  {
    email: 'karan.nair.demo@campusmarket.com',
    fullName: 'Karan Nair',
    enrollmentNumber: '0801IT201055',
    branch: 'it',
    year: 4,
    phone: '9812345602',
    profilePicture: 'https://res.cloudinary.com/rajvirgautam/image/upload/v1774382579/816YkOXY2NL._AC_UC200_200_CACC_200_200_QL85__mzr5v4.jpg',
    rating: 4.3,
    reviewCount: 9,
    totalSales: 11
  },
  {
    email: 'ananya.dubey.demo@campusmarket.com',
    fullName: 'Ananya Dubey',
    enrollmentNumber: '0801ME211089',
    branch: 'mech',
    year: 3,
    phone: '9812345603',
    profilePicture: 'https://res.cloudinary.com/rajvirgautam/image/upload/v1774382316/6yOrAQ8N-800-800_bsjtax.webp',
    rating: 4.9,
    reviewCount: 3,
    totalSales: 4
  }
];

// ─── Main Seed ────────────────────────────────────────────────────────────────
const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // ── 1. Clean up previous demo data ──────────────────────────────────────────
  const existingDemo = await User.findOne({ isDemoUser: true });
  if (existingDemo) {
    console.log('Cleaning up old demo data...');
    const otherDemoEmails = otherUsersData.map(u => u.email);
    const otherDemoUsers = await User.find({ email: { $in: otherDemoEmails } });
    const allDemoIds = [existingDemo._id, ...otherDemoUsers.map(u => u._id)];

    await Product.deleteMany({ seller: { $in: allDemoIds } });
    await Offer.deleteMany({ $or: [{ buyer: { $in: allDemoIds } }, { seller: { $in: allDemoIds } }] });
    await Conversation.deleteMany({ participants: { $in: allDemoIds } });
    await Deal.deleteMany({ $or: [{ buyer: { $in: allDemoIds } }, { seller: { $in: allDemoIds } }] });
    await User.deleteMany({ _id: { $in: allDemoIds } });
    console.log('Old demo data cleared.');
  }

  // ── 2. Create other demo users (sellers/buyers) ──────────────────────────────
  console.log('Creating supporting demo users...');
  const salt = await bcrypt.genSalt(12);
  const hashedPw = await bcrypt.hash('demopassword123', salt);

  const otherUsers = [];
  for (const data of otherUsersData) {
    const u = await User.create({
      ...data,
      password: hashedPw,
      authProvider: 'local',
      isVerified: true,
      verificationStatus: 'approved'
    });
    otherUsers.push(u);
  }
  const [riya, karan, ananya] = otherUsers;
  console.log('Supporting users created.');

  // ── 3. Create demo user ──────────────────────────────────────────────────────
  console.log('Creating demo user...');
  const demoUser = await User.create({
    email: DEMO_EMAIL,
    password: hashedPw,
    fullName: 'Arjun Mehta',
    enrollmentNumber: '0801CS210042',
    branch: 'cs',
    year: 3,
    phone: '9812345600',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ArjunMehta&backgroundColor=00D9FF',
    authProvider: 'local',
    isVerified: true,
    verificationStatus: 'approved',
    isDemoUser: true,
    rating: 4.6,
    reviewCount: 8,
    totalSales: 5,
    createdAt: daysAgo(90)
  });
  console.log('Demo user created:', demoUser._id);

  // ── 4. Products listed BY demo user (active) ─────────────────────────────────
  console.log('Creating demo user listings...');

  const listing1 = await Product.create({
    title: 'iPhone 13 Pro Max – 256GB Space Gray',
    description: 'Selling my iPhone 13 Pro Max as I\'m upgrading to 15 Pro. Bought in Dec 2021, used very carefully. Original box, charger, and both unused Apple EarPods included. No scratches on display (always had screen protector). Tiny scuff on back. Battery health 84%. iCloud unlocked.',
    price: 55000,
    type: 'sale',
    category: 'electronics',
    condition: 'Good',
    images: [
      'https://res.cloudinary.com/rajvirgautam/image/upload/v1774382316/6yOrAQ8N-800-800_bsjtax.webp'
    ],
    seller: demoUser._id,
    branch: 'all',
    year: 'all',
    highlights: [
      'Original box & accessories',
      'Battery health 84%',
      'iCloud unlocked',
      'No display scratches',
      'Always screen protector used'
    ],
    specs: [
      { label: 'Storage', value: '256GB' },
      { label: 'Color', value: 'Space Gray' },
      { label: 'Battery Health', value: '84%' },
      { label: 'Face ID', value: 'Working' },
      { label: 'Warranty', value: 'Expired' }
    ],
    status: 'active',
    views: 47,
    saves: 8,
    isTrending: true,
    createdAt: daysAgo(12)
  });

  const listing2 = await Product.create({
    title: 'Engineering Chemistry Lab Record – Complete (SGSITS)',
    description: 'Fully completed Chemistry Lab Record for 1st year (SGSITS format). All 12 experiments with proper observations, graphs, and viva questions. Will save you 10+ hours of effort. Neat handwriting, blue/black pen, no cut marks. Approved and signed by faculty.',
    price: 150,
    type: 'sale',
    category: 'books',
    condition: 'Like New',
    images: [
      'https://res.cloudinary.com/rajvirgautam/image/upload/v1774382579/816YkOXY2NL._AC_UC200_200_CACC_200_200_QL85__mzr5v4.jpg'
    ],
    seller: demoUser._id,
    branch: 'all',
    year: '1',
    highlights: [
      'All 12 experiments complete',
      'Faculty signed',
      'Graphs hand-drawn',
      'Viva questions included',
      'No cut marks'
    ],
    specs: [
      { label: 'Subject', value: 'Engineering Chemistry' },
      { label: 'Year', value: '1st Year' },
      { label: 'Experiments', value: '12 complete' },
      { label: 'Language', value: 'English' }
    ],
    status: 'active',
    views: 23,
    saves: 3,
    createdAt: daysAgo(5)
  });

  console.log('Listings created:', listing1._id, listing2._id);

  // ── 5. Products by other demo users (for conversations & offers) ──────────────
  console.log('Creating other sellers\' products...');

  const riyaProduct = await Product.create({
    title: 'Dell Inspiron 15 – Intel i5 11th Gen, 8GB RAM, 512GB SSD',
    description: 'Good condition Dell laptop, 1.5 years old. Runs fast, no heating issues. Charger included. Minor cosmetic scratches on lid. All ports working. Windows 11 activated.',
    price: 34000,
    type: 'sale',
    category: 'electronics',
    condition: 'Good',
    images: [
      'https://res.cloudinary.com/rajvirgautam/image/upload/v1774382316/6yOrAQ8N-800-800_bsjtax.webp'
    ],
    seller: riya._id,
    branch: 'all',
    year: 'all',
    status: 'active',
    views: 62,
    saves: 11,
    createdAt: daysAgo(8)
  });

  const karanProduct = await Product.create({
    title: 'GATE 2024 ECE – Arihant 30 Years Solved Papers',
    description: 'Arihant\'s GATE ECE solved papers (2024 edition), covers last 30 years. Used but no missing pages. A few topics highlighted in pencil. Perfect for last-month revision.',
    price: 380,
    type: 'sale',
    category: 'books',
    condition: 'Good',
    images: [
      'https://res.cloudinary.com/rajvirgautam/image/upload/v1774382579/816YkOXY2NL._AC_UC200_200_CACC_200_200_QL85__mzr5v4.jpg'
    ],
    seller: karan._id,
    branch: 'ece',
    year: '4',
    status: 'active',
    views: 18,
    saves: 4,
    createdAt: daysAgo(15)
  });

  const ananyaProduct = await Product.create({
    title: 'Casio FX-991EX Scientific Calculator',
    description: 'Casio ClassWiz FX-991EX. Works perfectly, battery replaced 2 months ago. Allowed in GATE and university exams. Comes with original cover.',
    price: 850,
    type: 'sale',
    category: 'stationery',
    condition: 'Like New',
    images: [
      'https://res.cloudinary.com/rajvirgautam/image/upload/v1774382316/6yOrAQ8N-800-800_bsjtax.webp'
    ],
    seller: ananya._id,
    branch: 'all',
    year: 'all',
    status: 'active',
    views: 31,
    saves: 7,
    createdAt: daysAgo(3)
  });

  console.log('Other sellers\' products created.');

  // ── 6. Products for past deals (already sold/bought) ──────────────────────────
  const soldByDemoProduct = await Product.create({
    title: 'JBL Tune 510BT Wireless Headphones',
    description: 'Used for 8 months. Sound quality excellent, mic works. Ear cushions slightly worn. Battery lasts ~30 hrs.',
    price: 1800,
    type: 'sale',
    category: 'electronics',
    condition: 'Good',
    images: [
      'https://res.cloudinary.com/rajvirgautam/image/upload/v1774382316/6yOrAQ8N-800-800_bsjtax.webp'
    ],
    seller: demoUser._id,
    branch: 'all',
    year: 'all',
    status: 'sold',
    views: 34,
    saves: 5,
    createdAt: daysAgo(45)
  });

  const boughtByDemoProduct = await Product.create({
    title: 'Fluid Mechanics – Frank White 7th Edition',
    description: 'Standard Fluid Mechanics textbook for Mech/Civil 3rd year. Good condition, no torn pages.',
    price: 400,
    type: 'sale',
    category: 'books',
    condition: 'Good',
    images: [
      'https://res.cloudinary.com/rajvirgautam/image/upload/v1774382579/816YkOXY2NL._AC_UC200_200_CACC_200_200_QL85__mzr5v4.jpg'
    ],
    seller: karan._id,
    branch: 'mech',
    year: '3',
    status: 'sold',
    views: 12,
    saves: 2,
    createdAt: daysAgo(60)
  });

  // ── 7. Saved products for demo user ──────────────────────────────────────────
  await Product.updateOne({ _id: riyaProduct._id }, { $addToSet: { savedBy: demoUser._id }, $inc: { saves: 1 } });
  await Product.updateOne({ _id: ananyaProduct._id }, { $addToSet: { savedBy: demoUser._id }, $inc: { saves: 1 } });
  console.log('Saved products set.');

  // ── 8. Incoming Offers on demo user's iPhone listing ─────────────────────────
  console.log('Creating incoming offers...');

  const offer1 = await Offer.create({
    product: listing1._id,
    buyer: karan._id,
    seller: demoUser._id,
    offerPrice: 50000,
    status: 'pending',
    message: 'Hey! I\'m interested in the iPhone 13 Pro Max. Would you consider ₹50,000? I can pick up today from campus.',
    createdAt: daysAgo(2)
  });

  const offer2 = await Offer.create({
    product: listing1._id,
    buyer: ananya._id,
    seller: demoUser._id,
    offerPrice: 52000,
    status: 'pending',
    message: 'The phone looks great! Can you do ₹52,000? I\'m a serious buyer, can meet at library block.',
    createdAt: daysAgo(1)
  });

  const offer3 = await Offer.create({
    product: listing1._id,
    buyer: riya._id,
    seller: demoUser._id,
    offerPrice: 48500,
    status: 'countered',
    message: 'Hi, offering ₹48,500 for the iPhone. Let me know if that works!',
    createdAt: daysAgo(4)
  });

  console.log('Offers created:', offer1._id, offer2._id, offer3._id);

  // ── 9. Conversations + Messages ───────────────────────────────────────────────
  console.log('Creating conversations and messages...');

  // Conversation 1: Demo (as buyer) → Riya about Dell Laptop
  const conv1 = await Conversation.create({
    participants: [demoUser._id, riya._id],
    product: riyaProduct._id,
    lastMessageAt: daysAgo(1)
  });

  const conv1Messages = [
    { sender: demoUser._id, content: 'Hey Riya! Is the Dell laptop still available?', createdAt: daysAgo(3) },
    { sender: riya._id, content: 'Yes it is! Are you interested?', createdAt: daysAgo(3) },
    { sender: demoUser._id, content: 'Yeah, can you share more details? How old is it and any issues?', createdAt: daysAgo(2) },
    { sender: riya._id, content: 'It\'s 1.5 years old. No heating issues, all ports work fine. Just a small cosmetic scratch on the lid.', createdAt: daysAgo(2) },
    { sender: demoUser._id, content: 'Okay, what\'s the best price you can do? I was thinking ₹31,000?', createdAt: daysAgo(2) },
    { sender: riya._id, content: '₹31,000 is too low honestly. I can do ₹33,000 final.', createdAt: daysAgo(1) },
    { sender: demoUser._id, content: 'Let me think about it. Can I check it in person first?', createdAt: daysAgo(1) },
    { sender: riya._id, content: 'Sure! Come to the CS department tomorrow after 2pm.', createdAt: daysAgo(1) }
  ];

  let lastMsg1;
  for (const m of conv1Messages) {
    lastMsg1 = await Message.create({ conversation: conv1._id, ...m, readBy: [m.sender] });
  }
  await Conversation.updateOne({ _id: conv1._id }, { lastMessage: lastMsg1._id, lastMessageAt: lastMsg1.createdAt });

  // Conversation 2: Demo (as buyer) → Karan about GATE book
  const conv2 = await Conversation.create({
    participants: [demoUser._id, karan._id],
    product: karanProduct._id,
    lastMessageAt: daysAgo(2)
  });

  const conv2Messages = [
    { sender: demoUser._id, content: 'Hi Karan! The GATE ECE book – does it cover 2024 papers?', createdAt: daysAgo(5) },
    { sender: karan._id, content: 'Yes it covers up to 2024, 30 years total. Super useful for pattern analysis.', createdAt: daysAgo(5) },
    { sender: demoUser._id, content: 'Any heavy underlining or writing inside?', createdAt: daysAgo(4) },
    { sender: karan._id, content: 'Just some pencil marks on Networks and Signals chapters. Erasable.', createdAt: daysAgo(4) },
    { sender: demoUser._id, content: 'Got it. Would ₹320 work?', createdAt: daysAgo(3) },
    { sender: karan._id, content: '₹350 is the lowest I can go. It\'s barely used.', createdAt: daysAgo(3) },
    { sender: demoUser._id, content: 'Alright, ₹350 is fine. Where can we meet?', createdAt: daysAgo(2) },
    { sender: karan._id, content: 'I\'m in Hostel Block B. Free after 6pm most days.', createdAt: daysAgo(2) }
  ];

  let lastMsg2;
  for (const m of conv2Messages) {
    lastMsg2 = await Message.create({ conversation: conv2._id, ...m, readBy: [m.sender] });
  }
  await Conversation.updateOne({ _id: conv2._id }, { lastMessage: lastMsg2._id, lastMessageAt: lastMsg2.createdAt });

  // Conversation 3: Demo (as buyer) → Ananya about calculator
  const conv3 = await Conversation.create({
    participants: [demoUser._id, ananya._id],
    product: ananyaProduct._id,
    lastMessageAt: daysAgo(1)
  });

  const conv3Messages = [
    { sender: demoUser._id, content: 'Is the Casio FX-991EX still available?', createdAt: daysAgo(2) },
    { sender: ananya._id, content: 'Yes! Just replaced the battery, works perfectly.', createdAt: daysAgo(2) },
    { sender: demoUser._id, content: 'Is it allowed in university end-sems?', createdAt: daysAgo(2) },
    { sender: ananya._id, content: 'Yes, it\'s on the approved list. I used it in all my end-sems at SGSITS.', createdAt: daysAgo(1) },
    { sender: demoUser._id, content: 'Perfect! Can you share a photo of the current condition?', createdAt: daysAgo(1) },
    { sender: ananya._id, content: 'I\'ve added more photos to the listing now. Check them out!', createdAt: daysAgo(1) }
  ];

  let lastMsg3;
  for (const m of conv3Messages) {
    lastMsg3 = await Message.create({ conversation: conv3._id, ...m, readBy: [m.sender] });
  }
  await Conversation.updateOne({ _id: conv3._id }, { lastMessage: lastMsg3._id, lastMessageAt: lastMsg3.createdAt });

  // Conversation 4: Demo (as seller) ↔ Karan about iPhone listing (offer context)
  const conv4 = await Conversation.create({
    participants: [demoUser._id, karan._id],
    product: listing1._id,
    lastMessageAt: daysAgo(1)
  });

  const conv4Messages = [
    { sender: karan._id, content: 'Hey, I sent an offer for ₹50,000 on your iPhone. Is it negotiable?', createdAt: daysAgo(2) },
    { sender: demoUser._id, content: 'Hi! The phone is in great condition, ₹50k is a bit low for me.', createdAt: daysAgo(2) },
    { sender: karan._id, content: 'What\'s the minimum you can do? I\'m a serious buyer.', createdAt: daysAgo(2) },
    { sender: demoUser._id, content: 'Best I can do is ₹53,500. It includes original accessories and box.', createdAt: daysAgo(1) },
    { sender: karan._id, content: 'Hmm, let me think. Battery at 84% is a little concerning.', createdAt: daysAgo(1) },
    { sender: demoUser._id, content: 'Fair point. I can do ₹52,000 considering that. Final offer.', createdAt: daysAgo(1) }
  ];

  let lastMsg4;
  for (const m of conv4Messages) {
    lastMsg4 = await Message.create({ conversation: conv4._id, ...m, readBy: [m.sender] });
  }
  await Conversation.updateOne({ _id: conv4._id }, { lastMessage: lastMsg4._id, lastMessageAt: lastMsg4.createdAt });

  console.log('Conversations and messages created.');

  // ── 10. Past Deals ────────────────────────────────────────────────────────────
  console.log('Creating past deals...');

  // Deal 1: Demo SOLD headphones to Riya (completed)
  const soldOffer = await Offer.create({
    product: soldByDemoProduct._id,
    buyer: riya._id,
    seller: demoUser._id,
    offerPrice: 1800,
    status: 'accepted',
    message: 'Deal!',
    createdAt: daysAgo(40)
  });

  await Deal.create({
    product: soldByDemoProduct._id,
    buyer: riya._id,
    seller: demoUser._id,
    agreedPrice: 1800,
    source: 'offer',
    sourceId: soldOffer._id,
    sellerConfirmedSold: true,
    dealStatus: 'sold',
    buyerReview: {
      rating: 5,
      comment: 'Great seller! Headphones exactly as described. Quick handover.',
      submittedAt: daysAgo(37)
    },
    sellerReview: {
      rating: 5,
      comment: 'Smooth transaction, buyer was punctual.',
      submittedAt: daysAgo(37)
    },
    createdAt: daysAgo(40)
  });

  // Deal 2: Demo BOUGHT Fluid Mechanics book from Karan (completed)
  const boughtOffer = await Offer.create({
    product: boughtByDemoProduct._id,
    buyer: demoUser._id,
    seller: karan._id,
    offerPrice: 400,
    status: 'accepted',
    message: 'I\'ll take it.',
    createdAt: daysAgo(55)
  });

  await Deal.create({
    product: boughtByDemoProduct._id,
    buyer: demoUser._id,
    seller: karan._id,
    agreedPrice: 400,
    source: 'offer',
    sourceId: boughtOffer._id,
    sellerConfirmedSold: true,
    dealStatus: 'sold',
    buyerReview: {
      rating: 4,
      comment: 'Book was in good condition as advertised. Happy with the purchase.',
      submittedAt: daysAgo(52)
    },
    sellerReview: {
      rating: 5,
      comment: 'Easy buyer, no haggling. Recommended!',
      submittedAt: daysAgo(52)
    },
    createdAt: daysAgo(55)
  });

  // Update demo user totalSales
  await User.updateOne({ _id: demoUser._id }, { totalSales: 5 });
  await User.updateOne({ _id: karan._id }, { totalSales: 11 });
  await User.updateOne({ _id: riya._id }, { totalSales: 7 });

  console.log('Past deals created.');

  console.log('\n==============================================');
  console.log('Demo user seeded successfully!');
  console.log('----------------------------------------------');
  console.log('Email   :', DEMO_EMAIL);
  console.log('Name    : Arjun Mehta');
  console.log('User ID :', demoUser._id.toString());
  console.log('----------------------------------------------');
  console.log('Active Listings : 2 (iPhone 13 PM, Chem Lab Record)');
  console.log('Saved Products  : 2 (Dell Laptop, Calculator)');
  console.log('Incoming Offers : 3 (all on iPhone listing)');
  console.log('Conversations   : 4');
  console.log('Past Deals      : 2 (1 sold, 1 bought)');
  console.log('==============================================\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
