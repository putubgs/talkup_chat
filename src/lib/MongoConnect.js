import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  throw new Error("Invalid environment variable: MONGO_URI");
}

export const connectMongoDB = async () => {
  try {
    const { connection } = await mongoose.connect(MONGO_URI);

    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
