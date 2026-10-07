const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freelancer_tracker');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // If MongoDB is not running locally, provide clear log message but don't crash process instantly in dev
    console.log('Ensure MongoDB service is running on your machine or update MONGO_URI in .env');
  }
};

module.exports = connectDB;
