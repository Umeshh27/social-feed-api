import express from "express";
import redisClient from "../config/redis.js";
import pool from "../config/db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/feed", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const limit = 5;
  const cursor = req.query.cursor;

  const feedKey = `feed:${userId}`;

  let postIds;

  // 🔹 REDIS READ (FAST PATH)
  if (cursor) {
    postIds = await redisClient.sendCommand([
      "ZREVRANGEBYSCORE",
      feedKey,
      cursor,
      "-inf",
      "LIMIT",
      "0",
      String(limit)
    ]);
  } else {
    postIds = await redisClient.sendCommand([
      "ZREVRANGE",
      feedKey,
      "0",
      String(limit - 1)
    ]);
  }

  // 🔹 CACHE MISS → REBUILD FEED
  if (!postIds || postIds.length === 0) {
    const dbResult = await pool.query(
      `
      SELECT p.*
      FROM posts p
      JOIN follows f ON p.user_id = f.following_id
      WHERE f.follower_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2
      `,
      [userId, limit]
    );

    return res.json({
      posts: dbResult.rows,
      nextCursor:
        dbResult.rows.length > 0
          ? new Date(dbResult.rows[dbResult.rows.length - 1].created_at).getTime()
          : null
    });
  }

  // 🔹 FETCH POSTS FROM DB
  const postsResult = await pool.query(
    `
    SELECT * FROM posts
    WHERE id = ANY($1::int[])
    ORDER BY created_at DESC
    `,
    [postIds]
  );

  const nextCursor =
    postsResult.rows.length > 0
      ? new Date(postsResult.rows[postsResult.rows.length - 1].created_at).getTime()
      : null;

  res.json({
    posts: postsResult.rows,
    nextCursor
  });
});

export default router;
