
const express = require("express");
const cors = require("cors");
const db = require("./config/database.js");

const userRoutes = require("./routes/userRoutes.js");
const screenTimeRoutes = require("./routes/screenTimeRoutes.js");

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
