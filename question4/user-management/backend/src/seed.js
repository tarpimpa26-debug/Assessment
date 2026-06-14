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

const users = buildUsers();
db.exec("BEGIN");
try {
  db.prepare("DELETE FROM users").run();
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
