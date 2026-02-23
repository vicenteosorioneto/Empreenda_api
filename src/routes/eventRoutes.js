import express from "express";
import Event from "../models/event.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const event = await Event.create(req.body);
  res.json(event);
});

export default router;
