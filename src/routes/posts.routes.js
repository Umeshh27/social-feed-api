import express from "express";
import { createPost } from "../services/post.service.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { content } = req.body;
  const post = await createPost(req.user.id, content);
  res.json(post);
});

export default router;
