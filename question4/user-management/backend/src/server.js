// src/server.js
// Express application entry point.
// Wires up middleware, mounts the user routes, and starts listening.

import express from "express";
import cors from "cors";
import userRoutes from "./userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Allow the React dev server (different port) to call this API.
app.use(cors());

// Parse JSON request bodies.
app.use(express.json());

// Simple health-check endpoint.
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "User Management API is running" });
});

// Mount all user endpoints under /api/user.
app.use("/api/user", userRoutes);

// Centralized error handler — catches anything thrown in the routes
// (e.g. malformed JSON) so the server never crashes silently.
app.use((err, _req, res, _next) => {
  console.error("Unexpected error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
