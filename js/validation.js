/**
 * Pure validation functions — no DOM access, so these can be
 * unit tested directly in Node without a browser.
 */

function isValidName(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value) {
  if (typeof value !== "string" || value.trim().length === 0) return false;
  // Reasonably strict, standard email pattern (not RFC-perfect, but catches real mistakes)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value.trim());
}

function isValidNigerianPhone(value) {
  if (typeof value !== "string") return false;
  // Strip spaces and dashes first — real users type "0803 123 4567" or
  // "0803-123-4567" as often as they type it plain. Only actual digits
  // and a leading 0 requirement matter, not spacing style.
  const digitsOnly = value.trim().replace(/[\s-]/g, "");
  // Must be exactly 11 digits, starting with 0
  return /^0\d{10}$/.test(digitsOnly);
}

/**
 * Validates the full form data object.
 * Returns an object mapping field name -> error message string.
 * A field with no error is simply absent from the returned object.
 */
function validateProfileForm(data) {
  const errors = {};

  if (!isValidName(data.fullName)) {
    errors.fullName = "Full name is required.";
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = "Phone number is required.";
  } else if (!isValidNigerianPhone(data.phone)) {
    errors.phone = "Enter an 11-digit number starting with 0 (e.g. 08031234567).";
  }

  return errors;
}

// Support both Node (for tests) and browser (script tag) environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    isValidName,
    isValidEmail,
    isValidNigerianPhone,
    validateProfileForm,
  };
}
