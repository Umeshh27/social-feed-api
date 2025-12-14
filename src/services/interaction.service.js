import pool from "../config/db.js";

/* LIKE POST */
export async function likePost(userId, postId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const res = await client.query(
      "INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userId, postId]
    );

    if (res.rowCount > 0) {
      await client.query(
        "UPDATE posts SET like_count = like_count + 1 WHERE id = $1",
        [postId]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/* UNLIKE POST */
export async function unlikePost(userId, postId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const res = await client.query(
      "DELETE FROM likes WHERE user_id=$1 AND post_id=$2",
      [userId, postId]
    );

    if (res.rowCount > 0) {
      await client.query(
        "UPDATE posts SET like_count = like_count - 1 WHERE id = $1",
        [postId]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/* ADD COMMENT */
export async function addComment(userId, postId, content) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3)",
      [userId, postId, content]
    );

    await client.query(
      "UPDATE posts SET comment_count = comment_count + 1 WHERE id = $1",
      [postId]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
