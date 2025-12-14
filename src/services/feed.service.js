import redisClient from "../config/redis.js";
import pool from "../config/db.js";

export async function fanOutPost(postId, authorId, createdAt) {
  const result = await pool.query(
    "SELECT follower_id FROM follows WHERE following_id=$1",
    [authorId]
  );

  for (const row of result.rows) {
    const feedKey = `feed:${row.follower_id}`;

    await redisClient.zAdd(feedKey, [{
      score: new Date(createdAt).getTime(),
      value: postId.toString()
    }]);

    await redisClient.expire(feedKey, 3600);
  }
}
