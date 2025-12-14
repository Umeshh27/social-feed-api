import pool from "../config/db.js";

export async function followUser(currentUserId, targetUserId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [currentUserId, targetUserId]
    );

    await client.query(
      "UPDATE users SET following_count = following_count + 1 WHERE id = $1",
      [currentUserId]
    );

    await client.query(
      "UPDATE users SET follower_count = follower_count + 1 WHERE id = $1",
      [targetUserId]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function unfollowUser(currentUserId, targetUserId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "DELETE FROM follows WHERE follower_id=$1 AND following_id=$2",
      [currentUserId, targetUserId]
    );

    await client.query(
      "UPDATE users SET following_count = following_count - 1 WHERE id = $1",
      [currentUserId]
    );

    await client.query(
      "UPDATE users SET follower_count = follower_count - 1 WHERE id = $1",
      [targetUserId]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
