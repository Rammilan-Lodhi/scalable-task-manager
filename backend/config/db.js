const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MONGO_URI not found in .env');
    }

    mongoose.set('strictQuery', true);

    await mongoose.connect(uri);

    console.log('[db] MongoDB Connected (Atlas)');
  } catch (error) {
    console.error('[db] Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
