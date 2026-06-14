// src/UserFormModal.jsx
// A modal dialog used for BOTH creating and editing a user.
// When `user` is null it acts as a "create" form; otherwise it
// pre-fills the fields and acts as an "edit" form.

import { useState, useEffect } from "react";

const EMPTY = { name: "", age: "", email: "", avatarUrl: "" };

export default function UserFormModal({ user, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(user);

  // Load the selected user's data into the form when editing.
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        age: String(user.age ?? ""),
        email: user.email ?? "",
        avatarUrl: user.avatarUrl ?? "",
      });
    } else {
      setForm(EMPTY);
    }
    setError("");
  }, [user]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Client-side checks mirror the server rules so the user gets fast
  // feedback. The server still validates again as the source of truth.
  function clientValidate() {
    if (!form.name.trim()) return "Name is required.";
    if (form.age === "" || Number.isNaN(Number(form.age)))
      return "Age must be a number.";
    if (!Number.isInteger(Number(form.age)) || Number(form.age) < 0)
      return "Age must be a whole number of 0 or more.";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOk) return "Enter a valid email address.";
    return "";
  }

  async function handleSave() {
    const msg = clientValidate();
    if (msg) {
      setError(msg);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        name: form.name.trim(),
        age: Number(form.age),
        email: form.email.trim(),
        avatarUrl: form.avatarUrl.trim(),
      });
      // onSubmit closes the modal on success.
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{isEdit ? "Edit user" : "Add user"}</h2>

        <label className="field">
          <span>Name</span>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Somchai Srisuk"
          />
        </label>

        <label className="field">
          <span>Age</span>
          <input
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
            placeholder="e.g. 30"
            inputMode="numeric"
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="e.g. somchai@example.com"
          />
        </label>

        <label className="field">
          <span>Avatar URL</span>
          <input
            value={form.avatarUrl}
            onChange={(e) => update("avatarUrl", e.target.value)}
            placeholder="https://..."
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create user"}
          </button>
        </div>
      </div>
    </div>
  );
}
