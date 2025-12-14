import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export async function registerUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users (username, profile_info) VALUES ($1, $2) RETURNING id",
    [username, hashedPassword]
  );

  return result.rows[0];
}
