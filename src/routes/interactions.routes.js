import express from "express";
import {
  likePost,
  unlikePost,
  addComment
} from "../services/interaction.service.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/posts/:postId/like", authMiddleware, async (req, res) => {
  await likePost(req.user.id, req.params.postId);
  res.json({ message: "Post liked" });
});

router.delete("/posts/:postId/unlike", authMiddleware, async (req, res) => {
  await unlikePost(req.user.id, req.params.postId);
  res.json({ message: "Post unliked" });
});

router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  const { content } = req.body;
  await addComment(req.user.id, req.params.postId, content);
  res.json({ message: "Comment added" });
});

export default router;
