document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profile-form");
  const successMessage = document.getElementById("success-message");

  const fields = {
    fullName: {
      input: document.getElementById("fullName"),
      error: document.getElementById("fullName-error"),
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("email-error"),
    },
    phone: {
      input: document.getElementById("phone"),
      error: document.getElementById("phone-error"),
    },
  };

  function clearFieldError(fieldName) {
    const field = fields[fieldName];
    field.input.setAttribute("aria-invalid", "false");
    field.error.textContent = "";
  }

  function setFieldError(fieldName, message) {
    const field = fields[fieldName];
    field.input.setAttribute("aria-invalid", "true");
    field.error.textContent = message;
  }

  function getFormData() {
    return {
      fullName: fields.fullName.input.value,
      email: fields.email.input.value,
      phone: fields.phone.input.value,
      emailAlerts: document.getElementById("emailAlerts").checked,
      smsAlerts: document.getElementById("smsAlerts").checked,
    };
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    successMessage.hidden = true;

    const data = getFormData();
    const errors = validateProfileForm(data);

    // Clear all errors first, then only mark the ones that are actually invalid.
    // This preserves valid fields' state instead of wiping everything on every submit.
    Object.keys(fields).forEach((fieldName) => {
      if (errors[fieldName]) {
        setFieldError(fieldName, errors[fieldName]);
      } else {
        clearFieldError(fieldName);
      }
    });

    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      // Move focus to the first invalid field for keyboard/screen-reader users
      const firstInvalidField = Object.keys(errors)[0];
      fields[firstInvalidField].input.focus();
      return;
    }

    // Mock save — no real backend, just log and confirm
    console.log("Profile saved (mock):", data);
    successMessage.hidden = false;
  });

  // Clear a field's error as soon as the user starts fixing it,
  // rather than making them re-submit to see if it's fixed.
  Object.keys(fields).forEach((fieldName) => {
    fields[fieldName].input.addEventListener("input", () => {
      if (fields[fieldName].input.getAttribute("aria-invalid") === "true") {
        clearFieldError(fieldName);
      }
    });
  });

  // Native `reset` clears input values automatically, but it does NOT clear
  // our custom error states (aria-invalid, error text) — that has to be done
  // explicitly, or Cancel would leave stale red error messages on screen
  // next to now-empty fields.
  form.addEventListener("reset", () => {
    successMessage.hidden = true;
    Object.keys(fields).forEach((fieldName) => clearFieldError(fieldName));
  });
});
