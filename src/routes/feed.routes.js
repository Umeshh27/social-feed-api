import express from "express";
import redisClient from "../config/redis.js";
import pool from "../config/db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/feed", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const limit = 10;

  const feedKey = `feed:${userId}`;

  const postIds = await redisClient.zRange(feedKey, 0, limit - 1, {
    REV: true
  });

  if (postIds.length === 0) {
    return res.json([]);
  }

  const result = await pool.query(
    `SELECT * FROM posts WHERE id = ANY($1::int[]) ORDER BY created_at DESC`,
    [postIds]
  );

  res.json(result.rows);
});

export default router;
