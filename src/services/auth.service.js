import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

// REGISTER USER
export async function registerUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users (username, profile_info) VALUES ($1, $2) RETURNING id",
    [username, hashedPassword]
  );

  return result.rows[0];
}

// LOGIN USER  ✅ (THIS IS STEP 6.5)
export async function loginUser(username, password) {
  const result = await pool.query(
    "SELECT * FROM users WHERE username=$1",
    [username]
  );

  if (result.rowCount === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];
  const isValid = await bcrypt.compare(password, user.profile_info);

  if (!isValid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return token;
}
