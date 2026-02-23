import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbUrl = process.env.MONGODB_URI || process.env.DB_URL;
    if (!dbUrl) {
      throw new Error("Missing DB connection string in env");
    }
    await mongoose.connect(dbUrl);
    console.log("Banco conectado");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
