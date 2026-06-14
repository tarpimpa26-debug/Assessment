// src/db.js
// Database layer: sets up the SQLite connection and the `users` table.
//
// Uses node:sqlite — the SQLite module built into Node.js (v22.5+).
// This means NO native compilation and NO extra npm dependency, so the
// project clones-and-runs identically on Windows, macOS, and Linux.

import { DatabaseSync } from "node:sqlite";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in an ES module (works on every OS).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Keep the SQLite file inside the backend folder so it is portable.
// path.join builds a correct path on any operating system.
const dbPath = path.join(__dirname, "..", "data.sqlite");

const db = new DatabaseSync(dbPath);

// WAL mode improves concurrent read/write performance.
db.exec("PRAGMA journal_mode = WAL;");

// Create the users table if it does not exist yet.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    age       INTEGER NOT NULL,
    email     TEXT    NOT NULL UNIQUE,
    avatarUrl TEXT
  )
`);

export default db;
