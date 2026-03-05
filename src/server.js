import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import screenTimeRoutes from "./routes/screenTimeRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
 res.send("API Empreenda+ online");
});

app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/screentime", screenTimeRoutes);

connectDB();

app.listen(3000, () => console.log("Servidor rodando"));