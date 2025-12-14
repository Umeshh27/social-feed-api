import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 3000;

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Database connection failed");
    console.error(err.message);
  } else {
    console.log("✅ Database connected at:", res.rows[0].now);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
