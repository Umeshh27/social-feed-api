import express from "express";
import { registerUser, loginUser } from "../services/auth.service.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await registerUser(username, password);
  res.json(user);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const token = await loginUser(username, password);
  res.json({ token });
});

export default router;
