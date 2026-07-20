# Manual Test Checklist — Profile Settings Form

Automated unit tests for the validation logic live in `tests/validation.test.js`
(run with `node tests/validation.test.js`) — 17/17 passing.

The checks below cover things the unit tests can't (actual DOM behavior, keyboard
navigation, visual state) and were walked through manually against `profile.html`.

## Fixes made after first self-review
- **Phone validation bug:** originally rejected realistic input like
  `0803 123 4567` or `0803-123-4567` because it required digits with zero
  spacing. Fixed by stripping spaces/dashes before validating. Added 3 tests
  covering this.
- **Missing Cancel button:** Round 1's output included a Cancel/reset button;
  my original Round 2 prompt didn't ask for one, so it was missing. Added a
  `type="reset"` button, plus a custom `reset` event handler — because native
  `reset` clears field values but does NOT clear custom error states, so
  without the extra handler, Cancel would leave stale red error text next to
  now-empty fields.
- **No visual required-field indicator:** added a `*` marker next to each
  required label (marked `aria-hidden="true"` since screen readers already
  get this from the `required` attribute/validation errors, so it doesn't
  need double-announcing).

## 1. Empty submit
- Action: Click "Save changes" with all fields blank.
- Expected: All three required fields (name, email, phone) show inline error text.
  No browser-native validation popup (form uses `novalidate` + custom handling).
- Verified: `validateProfileForm({fullName:"", email:"", phone:""})` returns all
  three error keys (confirmed by unit test `validateProfileForm flags all three
  fields when empty`). DOM wiring in `profile.js` maps each error key to its
  matching `setFieldError()` call, which sets `aria-invalid="true"` and fills
  the error `<p>`.

## 2. Invalid email
- Action: Enter a valid name and phone, but type `not-an-email` in the email field.
- Expected: Only the email field shows an error; name and phone fields remain
  untouched/uncleared if previously valid.
- Verified: Unit test `validateProfileForm only flags the invalid field, not
  valid ones` confirms the returned error object only contains `email`, and
  `profile.js`'s submit handler explicitly calls `clearFieldError()` for any
  field NOT in the errors object — so valid fields are never wiped.

## 3. Invalid phone
- Action: Enter `123` in the phone field.
- Expected: Error message "Enter an 11-digit number starting with 0."
- Verified: `isValidNigerianPhone` unit tests confirm rejection of short numbers,
  numbers not starting with 0, and non-digit characters — while now correctly
  ACCEPTING space- or dash-formatted valid numbers (fixed after initial review).

## 4. Valid submit
- Action: Fill all fields correctly (e.g. name "Jayeola Taiwo", email
  "test@example.com", phone "08031234567"), click Save.
- Expected: No error messages shown, success message appears
  ("Profile updated successfully."), form data logged to console.
- Verified: `validateProfileForm returns no errors for fully valid data` unit
  test confirms an empty error object for this exact input shape, which means
  `hasErrors` is false in `profile.js` and the success path runs.

## 5. Cancel button
- Action: Type invalid data, trigger errors, then click Cancel.
- Expected: Fields clear, all error messages/red states clear too, success
  message hides if it was showing.
- Verified: added a `reset` event listener specifically because native reset
  only clears field values, not the custom `aria-invalid`/error-text state —
  confirmed by reading the handler logic; this path is not covered by an
  automated test since it's DOM-only behavior (see limitation below).

## 6. Keyboard-only navigation
- Action: Using only Tab/Shift+Tab/Enter (no mouse), navigate through the form
  and submit.
- Expected: Focus visibly moves through fullName → email → phone → email
  alerts checkbox → SMS alerts checkbox → Save → Cancel, in that order
  (natural DOM order, no tabindex overrides needed). On submit with errors,
  focus jumps to the first invalid field automatically.
- Verified: `:focus-visible` outline is defined in `base.css`. The submit
  handler explicitly calls `fields[firstInvalidField].input.focus()` when
  errors exist, which moves focus without requiring a mouse.

## Known limitations (being upfront, not fixed)
- **No real browser walkthrough yet.** All checks above were verified through
  unit-tested logic and by reading the DOM wiring carefully — not by
  physically clicking through this in a browser. Logic review can miss things
  like visual overlap or a CSS rule accidentally hiding an element.
- **No automated DOM/integration tests.** I attempted to add `jsdom` for real
  DOM-level tests but the package install was blocked in my environment.
  Only the pure validation functions have automated tests; the actual event
  wiring in `profile.js` (e.g. Cancel behavior, focus-on-error) is verified
  by manual code reading only, not by an automated test that would catch a
  typo'd element ID.
