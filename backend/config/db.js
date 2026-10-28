import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blog_db';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.log(`[Database] Local MongoDB server unavailable (${error.message}).`);
    console.log(`[Database] In-memory fallback active. Connect MongoDB / Atlas URI in .env for persistent storage.`);
  }
};

export const getMongoStatus = () => isMongoConnected;
