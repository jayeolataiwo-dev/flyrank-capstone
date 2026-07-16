const form = document.getElementById("profile-form");
const saveAlert = document.getElementById("save-alert");
const errorAlert = document.getElementById("error-alert");
const avatarInitials = document.getElementById("avatar-initials");
const sidebarInitials = document.getElementById("sidebar-initials");
const sidebarUserName = document.getElementById("sidebar-user-name");
const sidebarUserId = document.getElementById("sidebar-user-id");
const displayName = document.getElementById("display-name");

let originalData = {};

function getInitials(firstName, lastName) {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName.charAt(0).toUpperCase();
  return first + last;
}

function populateForm(user) {
  document.getElementById("firstName").value = user.firstName;
  document.getElementById("lastName").value = user.lastName;
  document.getElementById("email").value = user.email;
  document.getElementById("phone").value = user.phone;
  document.getElementById("address").value = user.address;
  document.getElementById("userId").value = user.userId;
  document.getElementById("accountNo").value = user.accountNo;
  document.getElementById("simCard").value = user.simCard;

  document.getElementById("emailAlerts").checked = user.notifications.emailAlerts;
  document.getElementById("smsAlerts").checked = user.notifications.smsAlerts;
  document.getElementById("promoEmails").checked = user.notifications.promoEmails;
  document.getElementById("usageWarnings").checked = user.notifications.usageWarnings;

  const initials = getInitials(user.firstName, user.lastName);
  const fullName = user.firstName + " " + user.lastName;

  avatarInitials.textContent = initials;
  sidebarInitials.textContent = initials;
  sidebarUserName.textContent = fullName;
  sidebarUserId.textContent = user.userId;
  displayName.textContent = fullName;
}

function getFormData() {
  return {
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim(),
    notifications: {
      emailAlerts: document.getElementById("emailAlerts").checked,
      smsAlerts: document.getElementById("smsAlerts").checked,
      promoEmails: document.getElementById("promoEmails").checked,
      usageWarnings: document.getElementById("usageWarnings").checked
    }
  };
}

function hideAlerts() {
  saveAlert.classList.remove("is-visible");
  errorAlert.classList.remove("is-visible");
}

function showAlert(alertElement) {
  hideAlerts();
  alertElement.classList.add("is-visible");

  setTimeout(function () {
    alertElement.classList.remove("is-visible");
  }, 4000);
}

function clearFieldErrors() {
  const fields = form.querySelectorAll(".form-field.is-invalid");
  fields.forEach(function (field) {
    field.classList.remove("is-invalid");
  });
}

function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId).closest(".form-field");
  const errorEl = field.querySelector(".form-error");
  field.classList.add("is-invalid");
  errorEl.textContent = message;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^0[789][01]\d{8}$/.test(phone);
}

function validateForm() {
  clearFieldErrors();
  const data = getFormData();
  let isValid = true;

  if (!data.firstName) {
    setFieldError("firstName", "First name is required.");
    isValid = false;
  }

  if (!data.lastName) {
    setFieldError("lastName", "Last name is required.");
    isValid = false;
  }

  if (!data.email) {
    setFieldError("email", "Email is required.");
    isValid = false;
  } else if (!validateEmail(data.email)) {
    setFieldError("email", "Enter a valid email address.");
    isValid = false;
  }

  if (!data.phone) {
    setFieldError("phone", "Phone number is required.");
    isValid = false;
  } else if (!validatePhone(data.phone)) {
    setFieldError("phone", "Enter a valid Nigerian phone number (e.g. 08012345678).");
    isValid = false;
  }

  return isValid;
}

function handleSubmit(event) {
  event.preventDefault();
  hideAlerts();

  if (!validateForm()) {
    showAlert(errorAlert);
    return;
  }

  const updatedData = getFormData();
  originalData = Object.assign({}, mockUser, updatedData);

  populateForm(originalData);
  showAlert(saveAlert);
}

function handleReset() {
  hideAlerts();
  clearFieldErrors();
  populateForm(originalData);
}

originalData = Object.assign({}, mockUser);
populateForm(originalData);

form.addEventListener("submit", handleSubmit);
document.getElementById("cancel-btn").addEventListener("click", handleReset);
