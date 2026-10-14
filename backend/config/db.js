const mongoose = require('mongoose');
const dns = require('dns');

// Use Google DNS to prevent querySrv ENOTFOUND errors common on Windows/ISPs
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  // Fall back to default system DNS
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freelancer_tracker', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Local MongoDB connection failed (${error.message}). Initializing MongoMemoryServer...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected via MongoMemoryServer: ${conn.connection.host}`);
    } catch (memErr) {
      console.error(`MongoDB Memory Server Error: ${memErr.message}`);
    }
  }

  try {
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('⚡ Database has no users. Seeding initial demo data...');
      const seedData = require('../seed');
      await seedData();
    }
  } catch (seedErr) {
    console.log('Auto-seed check notice:', seedErr.message);
  }
};

module.exports = connectDB;
