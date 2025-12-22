import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/documentwallet";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected ${conn.connection.host}`);
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
