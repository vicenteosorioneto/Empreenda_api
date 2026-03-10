import express from "express";
import Event from "../models/event.js";

const router = express.Router();

// Criar evento
router.post("/", async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar todos os eventos
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate('userId', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar eventos por usuário
router.get("/user/:userId", async (req, res) => {
  try {
    const events = await Event.find({ userId: req.params.userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
