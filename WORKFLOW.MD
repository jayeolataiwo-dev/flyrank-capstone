# WORKFLOW.md

## The drill

Built the same feature (a profile settings form with validation) twice, on separate branches, in separate AI sessions with no shared context.

- **Round 1 (`round-1-vague`):** one-sentence prompt — "Build me a profile settings form." No file references, no constraints, no follow-up.
- **Round 2 (`round-2-precise`):** a detailed prompt specifying exact fields, validation rules, accessibility requirements, and an explicit instruction to write and run tests before calling it done.

## Correctness

The most important finding here surprised me: **Round 1's phone number regex is actually more correct than Round 2's.** Round 1 used `/^0[789][01]\d{8}$/`, which checks a real Nigerian mobile number pattern (starts with 0, second digit 7/8/9, third digit 0/1, then 8 more digits). My "precise" prompt only specified "11 digits starting with 0," so Round 2's regex (`/^0\d{10}$/`) would wrongly accept a nonsense number like `01111111111`. Being precise about _structure_ (fields, error handling, tests) didn't guarantee I was precise about _domain correctness_ — I wrote a validation rule that was technically what I asked for, but not actually right.

That said, Round 1's correctness is entirely unverified — it has zero tests. Round 2's 17 unit tests mean I can _prove_ what it does and doesn't handle (including catching and fixing a real bug: the original phone regex rejected realistically formatted input like `0803 123 4567`). Round 1 might have the same bug, or worse ones — nobody knows, because nothing tests it.

## Accessibility

Round 2 wins clearly here, but only because I explicitly asked for it. Round 1 never used `aria-invalid` on the inputs themselves — it only toggled a CSS class on the parent wrapper, which means a screen reader user wouldn't get the invalid-state signal the same way. Round 2 sets `aria-invalid="true/false"` directly on each input and moves keyboard focus to the first invalid field on a failed submit. Round 1 does neither. This wasn't the AI being "smarter" in Round 2 — it's a direct result of my prompt naming these requirements explicitly. Left unstated, accessibility didn't happen on its own.

## Edge cases / scope

Here Round 1 actually did more, not less. Because it read my project's `CLAUDE.md`/README for context, it inferred a fuller scope than I specified in Round 2: first/last name split, an address field, a read-only account details section, four notification types instead of two, a security/password section, pre-filled mock data, and `autocomplete` attributes on every field. My precise Round 2 prompt only named three fields and two toggles — so it built exactly that, and nothing more. The lesson: a vague prompt isn't automatically a worse _scope_, because the AI fills gaps using ambient project context. A precise prompt is only as complete as what you remember to specify — I forgot the pre-filled data and the Cancel-restores-original-data behavior, and Round 2 simply doesn't have them.

## Review effort

Round 1 took less time to produce, but I have zero confidence in it beyond reading the code by eye — no way to verify the phone regex, the alert timing, or the reset behavior actually work as intended without manually testing in a browser myself. Round 2 took noticeably longer up front (writing the detailed prompt, then me self-reviewing and catching four real issues: the phone-formatting bug, a missing Cancel button, no required-field indicator, and no DOM-level tests since a package install was blocked). But once done, I could hand it over with actual proof — 17 passing tests I ran myself, not just claimed. The mentor tip about round two "feeling slower but being faster end-to-end" held true here: fixing the phone bug now, with tests in place, took minutes; finding the same bug in Round 1's untested code later, mid-project, would have cost much more.

## The mistake I caught

Round 2's own first draft had the phone-formatting bug — rejecting real user input like `0803 123 4567` because I only specified "11 digits," not "11 digits regardless of spacing." I caught it by writing and running a test, not by reading the code and assuming it was fine.
