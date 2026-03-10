import express from "express";
import cors from "cors";
import db from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import screenTimeRoutes from "./routes/screenTimeRoutes.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Empreenda+ com SQLite online");
});

app.use("/users", userRoutes);
app.use("/screentime", screenTimeRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
