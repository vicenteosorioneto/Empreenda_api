import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbUrl = process.env.MONGODB_URI || process.env.DB_URL;
    if (!dbUrl) {
      throw new Error("Missing DB connection string in env");
    }
    console.log("🔄 Conectando ao MongoDB...");
    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 10000, // Timeout de 10 segundos
      socketTimeoutMS: 45000,
    });
    console.log("✅ Banco conectado com sucesso");
  } catch (err) {
    console.error("❌ Erro ao conectar ao banco:", err.message);
    process.exit(1);
  }
};

export default connectDB;
