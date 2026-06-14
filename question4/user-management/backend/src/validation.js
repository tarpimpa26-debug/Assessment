// src/validation.js
// Small, reusable validators for the user payload.
// Keeping them in one place makes create/update logic clean and consistent.

// A practical email regex. Not RFC-perfect (those are huge), but it
// reliably rejects the common bad cases the test asks us to catch.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return typeof email === "string" && EMAIL_REGEX.test(email);
}

// age must be a number (the test states "age ต้องเป็นตัวเลข").
// We accept integers >= 0 and reject strings like "abc" or "12a".
export function isValidAge(age) {
  return typeof age === "number" && Number.isInteger(age) && age >= 0;
}

// Validates the whole payload for create/update.
// Returns an array of human-readable error messages (empty = valid).
export function validateUserPayload(body) {
  const errors = [];

  if (!body || typeof body !== "object") {
    return ["Request body is required"];
  }

  const { name, age, email } = body;

  if (typeof name !== "string" || name.trim() === "") {
    errors.push("name is required and must be a non-empty string");
  }

  if (!isValidAge(age)) {
    errors.push("age is required and must be a number");
  }

  if (!isValidEmail(email)) {
    errors.push("email is required and must be a valid email address");
  }

  return errors;
}
