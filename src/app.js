import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import postRoutes from "./routes/posts.routes.js";
import interactionRoutes from "./routes/interactions.routes.js";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/", interactionRoutes);

app.get("/", (req, res) => {
  res.send("Social Feed API is running");
});

export default app;
