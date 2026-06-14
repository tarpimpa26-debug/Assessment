// src/api.js
// A thin wrapper around fetch for talking to the backend REST API.
// Centralizing it here keeps the components clean and makes error
// handling consistent across the app.

const BASE = "/api/user";

// Helper: parse JSON and throw a useful error if the response failed.
async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Prefer a server-provided message; fall back to a generic one.
    const message =
      data.error ||
      (data.errors && data.errors.join(", ")) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

// GET /api/user?q=&start=&limit=
export async function listUsers({ q = "", start = 0, limit = 10 } = {}) {
  const params = new URLSearchParams({ q, start, limit });
  const res = await fetch(`${BASE}?${params.toString()}`);
  return handle(res);
}

// GET /api/user/:id
export async function getUser(id) {
  const res = await fetch(`${BASE}/${id}`);
  return handle(res);
}

// POST /api/user
export async function createUser(payload) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

// PUT /api/user/:id
export async function updateUser(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

// DELETE /api/user/:id
export async function deleteUser(id) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  return handle(res);
}
