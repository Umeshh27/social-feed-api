import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Social Feed API is running");
});

export default app;
