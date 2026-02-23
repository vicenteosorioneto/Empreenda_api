import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
	const user = await User.create(req.body);
	res.json(user);
});

export default router;