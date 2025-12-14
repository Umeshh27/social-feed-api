import express from "express";
import { followUser, unfollowUser } from "../services/follow.service.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/:userId/follow", authMiddleware, async (req, res) => {
  await followUser(req.user.id, req.params.userId);
  res.json({ message: "Followed successfully" });
});

router.delete("/:userId/unfollow", authMiddleware, async (req, res) => {
  await unfollowUser(req.user.id, req.params.userId);
  res.json({ message: "Unfollowed successfully" });
});

export default router;
