const assert = require("assert");
const {
  isValidName,
  isValidEmail,
  isValidNigerianPhone,
  validateProfileForm,
} = require("../js/validation.js");

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`PASS: ${description}`);
    passed++;
  } catch (err) {
    console.log(`FAIL: ${description}`);
    console.log(`  ${err.message}`);
    failed++;
  }
}

// --- isValidName ---
test("isValidName rejects empty string", () => {
  assert.strictEqual(isValidName(""), false);
});
test("isValidName rejects whitespace-only string", () => {
  assert.strictEqual(isValidName("   "), false);
});
test("isValidName accepts a real name", () => {
  assert.strictEqual(isValidName("Jayeola Taiwo"), true);
});

// --- isValidEmail ---
test("isValidEmail rejects empty string", () => {
  assert.strictEqual(isValidEmail(""), false);
});
test("isValidEmail rejects missing @", () => {
  assert.strictEqual(isValidEmail("not-an-email.com"), false);
});
test("isValidEmail rejects missing domain dot", () => {
  assert.strictEqual(isValidEmail("test@domain"), false);
});
test("isValidEmail accepts a valid email", () => {
  assert.strictEqual(isValidEmail("tosintaiwo085@gmail.com"), true);
});

// --- isValidNigerianPhone ---
test("isValidNigerianPhone rejects too few digits", () => {
  assert.strictEqual(isValidNigerianPhone("080312"), false);
});
test("isValidNigerianPhone rejects number not starting with 0", () => {
  assert.strictEqual(isValidNigerianPhone("18031234567"), false);
});
test("isValidNigerianPhone rejects letters mixed in", () => {
  assert.strictEqual(isValidNigerianPhone("0803abc4567"), false);
});
test("isValidNigerianPhone accepts a valid 11-digit number", () => {
  assert.strictEqual(isValidNigerianPhone("08031234567"), true);
});
test("isValidNigerianPhone accepts a number formatted with spaces", () => {
  assert.strictEqual(isValidNigerianPhone("0803 123 4567"), true);
});
test("isValidNigerianPhone accepts a number formatted with dashes", () => {
  assert.strictEqual(isValidNigerianPhone("0803-123-4567"), true);
});
test("isValidNigerianPhone still rejects a genuinely short number even with spaces", () => {
  assert.strictEqual(isValidNigerianPhone("0803 123"), false);
});

// --- validateProfileForm (integration of the above) ---
test("validateProfileForm returns no errors for fully valid data", () => {
  const errors = validateProfileForm({
    fullName: "Jayeola Taiwo",
    email: "tosintaiwo085@gmail.com",
    phone: "08031234567",
  });
  assert.deepStrictEqual(errors, {});
});

test("validateProfileForm flags all three fields when empty", () => {
  const errors = validateProfileForm({ fullName: "", email: "", phone: "" });
  assert.ok(errors.fullName);
  assert.ok(errors.email);
  assert.ok(errors.phone);
});

test("validateProfileForm only flags the invalid field, not valid ones", () => {
  const errors = validateProfileForm({
    fullName: "Jayeola Taiwo",
    email: "not-valid",
    phone: "08031234567",
  });
  assert.ok(errors.email);
  assert.strictEqual(errors.fullName, undefined);
  assert.strictEqual(errors.phone, undefined);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
