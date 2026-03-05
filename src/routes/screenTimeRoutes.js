import express from "express";
import ScreenTime from "../models/screenTime.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { sessions } = req.body;

  if (!sessions || !Array.isArray(sessions)) {
    return res.status(400).json({ message: "Formato de dados inválido. 'sessions' deve ser um array." });
  }

  try {
    await ScreenTime.insertMany(sessions);
    res.status(201).json({ message: "Dados de tempo de tela salvos com sucesso." });
  } catch (error) {
    console.error("Erro ao salvar dados de tempo de tela:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

export default router;
