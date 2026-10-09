const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freelancer_tracker', {
      serverSelectionTimeoutMS: 2000,
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
};

module.exports = connectDB;
