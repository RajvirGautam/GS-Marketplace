import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixIndexes = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected!');

    const collection = mongoose.connection.db.collection('users');

    // List current indexes
    console.log('\n📋 Current indexes:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });

    // Drop clerkUserId index
    try {
      console.log('\n🗑️  Dropping clerkUserId_1 index...');
      await collection.dropIndex('clerkUserId_1');
      console.log('✅ Successfully dropped clerkUserId_1 index!');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('⚠️  Index already removed or doesn\'t exist');
      } else {
        throw error;
      }
    }

    // Verify final indexes
    console.log('\n📋 Final indexes:');
    const finalIndexes = await collection.indexes();
    finalIndexes.forEach(index => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });

    await mongoose.connection.close();
    console.log('\n✅ Done! You can now use Google OAuth.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixIndexes();
