import mongoose from "mongoose";
export default async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("Missing MONGO_URI");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, { dbName: process.env.MONGO_DB || "me_api" });
    console.log("✅ MongoDB connected");
  } catch (e) {
    console.error("❌ Mongo error", e);
    process.exit(1);
  }
}
