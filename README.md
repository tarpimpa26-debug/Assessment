# User Management — Full-stack Test (Question 4)

A small full-stack app: a REST API backend (Express + SQLite) and a
React frontend with search, a data table, create / edit / delete, and
pagination.

This project runs identically on **Windows**, **macOS**, and **Linux**.
It uses Node's built-in SQLite (`node:sqlite`), so there is **no native
module to compile** and nothing to install beyond `npm install`.

---

## Requirements

- **Node.js v22.5 or newer** (needed for the built-in `node:sqlite` module)
  Check your version with:
  ```bash
  node -v
  ```
  If it prints something lower than `v22.5`, download the latest LTS from
  https://nodejs.org and reinstall.

---

## Project structure

```
user-management/
├── backend/     Express REST API + SQLite
└── frontend/    React app (Vite)
```

The two parts run as **two separate processes**, so you will use **two
terminal windows**.

---

## 1. Start the backend

```bash
cd backend
npm install
npm run seed     # creates the database and fills it with 25 sample users
npm start        # starts the API at http://localhost:3001
```

Leave this terminal running.

> `npm run seed` is optional but recommended — it gives the table some
> data to show. You can re-run it any time to reset the data.

### API endpoints

| Method | URL                                      | Description                          |
|--------|------------------------------------------|--------------------------------------|
| GET    | `/api/user?q=&start=0&limit=10`          | List users (search + pagination)     |
| GET    | `/api/user/:userId`                      | Get one user                         |
| POST   | `/api/user`                              | Create a user                        |
| PUT    | `/api/user/:userId`                      | Update a user                        |
| DELETE | `/api/user/:userId`                      | Delete a user                        |

- `q` searches by **name or email** (partial match).
- `start` is the row offset; `limit` is the page size.
- `age` must be a number; `email` must be valid and unique.

---

## 2. Start the frontend

Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev      # starts the UI at http://localhost:5173
```

Then open **http://localhost:5173** in your browser.

The Vite dev server proxies any `/api/...` request to the backend on
port 3001, so both parts work together with no extra configuration.

---

## Notes

- The SQLite database file (`backend/data.sqlite`) is created
  automatically and is **git-ignored** — it is not committed.
- If port 3001 or 5173 is already in use, stop the other process or
  change the port (`PORT=3002 npm start` for the backend; edit
  `frontend/vite.config.js` for the frontend).

---

## Tech stack

- **Backend:** Node.js, Express, `node:sqlite` (built-in)
- **Frontend:** React, Vite, plain CSS (no UI framework)
