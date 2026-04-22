const mongoose = require('mongoose');

const connectDB = async () => {
  const uri =
    process.env.MONGO_URI ||
    'mongodb://admin:root@127.0.0.1:27017/TaskManager?authSource=admin';

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log(`[db] Connected to MongoDB at ${uri.split('@')[1] || uri}`);
};

module.exports = connectDB;
