import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "social_feed",
  password: "Umesh2006",
  port: 5432,
});

export default pool;
