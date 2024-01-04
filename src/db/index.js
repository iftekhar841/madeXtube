import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const MONGO_URL = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGO_URL}/${DB_NAME}`
    );

    console.log(
      `MongoDB connected! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection Failed! ", error);
    process.exit(1);
  }
};

export default connectDB;
