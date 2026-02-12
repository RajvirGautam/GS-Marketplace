import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB!');
    
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📦 Collections:', collections.map(c => c.name));
    
    // Count users
    const userCount = await db.collection('users').countDocuments();
    console.log('\n👥 Total Users:', userCount);
    
    // Get all users
    if (userCount > 0) {
      const users = await db.collection('users').find({}).toArray();
      console.log('\n📋 Users:');
      users.forEach(user => {
        console.log(`  - ${user.fullName} (${user.email})`);
        console.log(`    ID: ${user._id}`);
        console.log(`    Auth: ${user.authProvider}`);
        console.log(`    Verified: ${user.isVerified}`);
        console.log('');
      });
    } else {
      console.log('\n⚠️  No users found in database!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkDB();
