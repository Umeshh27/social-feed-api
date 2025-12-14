import pool from "../config/db.js";
import { fanOutPost } from "./feed.service.js";

export async function createPost(userId, content) {
  const result = await pool.query(
    "INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *",
    [userId, content]
  );

  const post = result.rows[0];

  // 🔥 FAN-OUT-ON-WRITE (CORE FEATURE)
  await fanOutPost(post.id, userId, post.created_at);

  return post;
}
