// src/userRoutes.js
// All five REST endpoints for the `users` resource.
//
//   GET    /api/user            -> list users (search + pagination)
//   GET    /api/user/:userId    -> get one user
//   POST   /api/user            -> create a user
//   PUT    /api/user/:userId    -> update a user
//   DELETE /api/user/:userId    -> delete a user

import { Router } from "express";
import db from "./db.js";
import { validateUserPayload } from "./validation.js";

const router = Router();

// ---------------------------------------------------------------------------
// GET /api/user?q=...&start=0&limit=10
// q     -> search by name OR email (partial match)
// start -> offset (row to start from)
// limit -> max number of rows
// ---------------------------------------------------------------------------
router.get("/", (req, res) => {
  const q = (req.query.q || "").toString().trim();

  // Parse start/limit safely; fall back to sensible defaults.
  let start = parseInt(req.query.start, 10);
  let limit = parseInt(req.query.limit, 10);
  if (Number.isNaN(start) || start < 0) start = 0;
  if (Number.isNaN(limit) || limit < 0) limit = 10;

  // Use a LIKE pattern for partial, case-insensitive matching.
  const pattern = `%${q}%`;

  // Build the WHERE clause only when a search term is present.
  const where = q ? "WHERE name LIKE ? OR email LIKE ?" : "";
  const filterParams = q ? [pattern, pattern] : [];

  // Total count (for the frontend pagination control).
  const total = db
    .prepare(`SELECT COUNT(*) AS count FROM users ${where}`)
    .get(...filterParams).count;

  // Page of data.
  const rows = db
    .prepare(
      `SELECT id, name, age, email, avatarUrl
       FROM users ${where}
       ORDER BY id
       LIMIT ? OFFSET ?`
    )
    .all(...filterParams, limit, start);

  res.json({ total, start, limit, data: rows });
});

// ---------------------------------------------------------------------------
// GET /api/user/:userId  -> single user detail
// ---------------------------------------------------------------------------
router.get("/:userId", (req, res) => {
  const user = db
    .prepare("SELECT id, name, age, email, avatarUrl FROM users WHERE id = ?")
    .get(req.params.userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

// ---------------------------------------------------------------------------
// POST /api/user  -> create
// Validates payload, enforces unique email.
// ---------------------------------------------------------------------------
router.post("/", (req, res) => {
  const errors = validateUserPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { name, age, email, avatarUrl = null } = req.body;

  // Enforce unique email at the application level for a clean message
  // (the DB also has a UNIQUE constraint as a safety net).
  const existing = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email);
  if (existing) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const info = db
    .prepare(
      "INSERT INTO users (name, age, email, avatarUrl) VALUES (?, ?, ?, ?)"
    )
    .run(name.trim(), age, email, avatarUrl);

  const created = db
    .prepare("SELECT id, name, age, email, avatarUrl FROM users WHERE id = ?")
    .get(info.lastInsertRowid);

  res.status(201).json(created);
});

// ---------------------------------------------------------------------------
// PUT /api/user/:userId  -> update
// Same validation as create; email must stay unique (excluding self).
// ---------------------------------------------------------------------------
router.put("/:userId", (req, res) => {
  const { userId } = req.params;

  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const errors = validateUserPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { name, age, email, avatarUrl = null } = req.body;

  // Make sure the email is not used by a *different* user.
  const clash = db
    .prepare("SELECT id FROM users WHERE email = ? AND id != ?")
    .get(email, userId);
  if (clash) {
    return res.status(409).json({ error: "Email already exists" });
  }

  db.prepare(
    "UPDATE users SET name = ?, age = ?, email = ?, avatarUrl = ? WHERE id = ?"
  ).run(name.trim(), age, email, avatarUrl, userId);

  const updated = db
    .prepare("SELECT id, name, age, email, avatarUrl FROM users WHERE id = ?")
    .get(userId);

  res.json(updated);
});

// ---------------------------------------------------------------------------
// DELETE /api/user/:userId
// Returns success; returns failed if the user was already deleted / missing.
// ---------------------------------------------------------------------------
router.delete("/:userId", (req, res) => {
  const info = db
    .prepare("DELETE FROM users WHERE id = ?")
    .run(req.params.userId);

  // info.changes === 0 means nothing was deleted (already gone).
  if (info.changes === 0) {
    return res
      .status(404)
      .json({ success: false, message: "User not found or already deleted" });
  }

  res.json({ success: true, message: "User deleted" });
});

export default router;
