import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI is not set - cannot connect to MongoDB");
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    return false;
  }
};

export const connectDBWithRetry = async (delayMs = 5000) => {
  const connected = await connectDB();
  if (!connected) {
    setTimeout(() => connectDBWithRetry(delayMs), delayMs);
  }
};

export const isDBConnected = () => mongoose.connection.readyState === 1;
