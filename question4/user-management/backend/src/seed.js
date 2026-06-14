// src/seed.js
// Populates the database with mock users so the table + pagination
// have something to show. Safe to run multiple times: it clears first.
//
// Run with:  npm run seed

import db from "./db.js";

const firstNames = [
  "Somchai", "Suda", "Anan", "Ploy", "Krit", "Nicha", "Wirote", "Mali",
  "Thana", "Pim", "Chai", "Fon", "Decha", "Aom", "Korn", "Beam",
  "Nattapong", "Ying", "Surasak", "Mint", "Peerapat", "Gade", "Wichai",
  "Som", "Tanawat",
];

const lastNames = [
  "Srisuk", "Wong", "Charoen", "Boon", "Rat", "Pho", "Suk", "Chan",
];

// Build 25 deterministic mock users.
function buildUsers() {
  const users = [];
  for (let i = 0; i < 25; i++) {
    const first = firstNames[i % firstNames.length];
    const last = lastNames[i % lastNames.length];
    const name = `${first} ${last}`;
    const age = 20 + (i % 30); // ages 20–49
    const email = `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`;
    const avatarUrl = `https://i.pravatar.cc/150?img=${(i % 70) + 1}`;
    users.push({ name, age, email, avatarUrl });
  }
  return users;
}

const insert = db.prepare(
  "INSERT INTO users (name, age, email, avatarUrl) VALUES (?, ?, ?, ?)"
);

// node:sqlite has no transaction() helper, so we use explicit
// BEGIN / COMMIT (with ROLLBACK on error) to insert atomically.
const users = buildUsers();
db.exec("BEGIN");
try {
  db.prepare("DELETE FROM users").run();
  // Reset the auto-increment counter so ids start at 1 again.
  db.prepare("DELETE FROM sqlite_sequence WHERE name = 'users'").run();
  for (const u of users) {
    insert.run(u.name, u.age, u.email, u.avatarUrl);
  }
  db.exec("COMMIT");
  console.log("Seeded 25 mock users.");
} catch (err) {
  db.exec("ROLLBACK");
  console.error("Seed failed:", err.message);
  process.exit(1);
}
