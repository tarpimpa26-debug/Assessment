import { useState, useEffect, useCallback } from "react";
import { listUsers, createUser, updateUser, deleteUser } from "./api.js";
import UserFormModal from "./UserFormModal.jsx";

const PAGE_SIZE = 10;

export default function App() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1); // 1-based page number
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [modalUser, setModalUser] = useState(undefined);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));


  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const start = (page - 1) * PAGE_SIZE;
      const result = await listUsers({ q: search, start, limit: PAGE_SIZE });
      setUsers(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err.message);
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  function onSearchChange(value) {
    setSearch(value);
    setPage(1); 
  }

  async function handleCreate(payload) {
    await createUser(payload);
    setModalUser(undefined);
    await load();
  }

  async function handleUpdate(payload) {
    await updateUser(modalUser.id, payload);
    setModalUser(undefined);
    await load();
  }

  async function handleDelete(user) {
    const ok = window.confirm(`Delete "${user.name}"?`);
    if (!ok) return;
    try {
      await deleteUser(user.id);
      const remaining = total - 1;
      const newTotalPages = Math.max(1, Math.ceil(remaining / PAGE_SIZE));
      if (page > newTotalPages) setPage(newTotalPages);
      else await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">User directory</p>
          <h1>People</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setModalUser(null)}>
          + Add user
        </button>
      </header>

      <div className="toolbar">
        <input
          className="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email…"
        />
        <span className="count">{total} total</span>
      </div>

      {error && <p className="banner banner-error">{error}</p>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th className="col-avatar"></th>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="empty">Loading…</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty">
                  No users found. Try a different search or add one.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="col-avatar">
                    {u.avatarUrl ? (
                      <img className="avatar" src={u.avatarUrl} alt="" />
                    ) : (
                      <span className="avatar avatar-fallback">
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td>{u.name}</td>
                  <td>{u.age}</td>
                  <td className="email">{u.email}</td>
                  <td className="col-actions">
                    <button className="btn btn-small" onClick={() => setModalUser(u)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(u)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="btn btn-ghost"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || loading}
        >
          ← Prev
        </button>
        <span className="page-info">Page {page} of {totalPages}</span>
        <button
          className="btn btn-ghost"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || loading}
        >
          Next →
        </button>
      </div>

      {modalUser !== undefined && (
        <UserFormModal
          user={modalUser}
          onClose={() => setModalUser(undefined)}
          onSubmit={modalUser ? handleUpdate : handleCreate}
        />
      )}
    </div>
  );
}
