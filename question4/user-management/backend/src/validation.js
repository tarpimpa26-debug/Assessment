const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return typeof email === "string" && EMAIL_REGEX.test(email);
}


export function isValidAge(age) {
  return typeof age === "number" && Number.isInteger(age) && age >= 0;
}

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
