import express from "express";
import cors from "cors";
import userRoutes from "./userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "User Management API is running" });
});

app.use("/api/user", userRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unexpected error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
