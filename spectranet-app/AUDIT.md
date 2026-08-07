# AUDIT.md — Performance & Accessibility Audit

## Tooling note
Initial local Lighthouse runs (via Chrome DevTools) gave unreliable, noisy Performance scores (72, then 69) because the local dev machine was under load (VS Code, dev server, and other processes running simultaneously), which throws off Lighthouse's CPU throttling simulation. Switching to **PageSpeed Insights** (Google's server-hosted Lighthouse, unaffected by local machine load) gave clean, trustworthy, reproducible numbers — used for all scores below.

## Homepage (`/`)

### Before
| Metric | Score |
|---|---|
| Performance | 98 |
| Accessibility | 95 |
| Best Practices | 100 |
| SEO | 100 |

**Issue found:** Contrast failure on the `<h1>` heading ("Spectranet Redesign Project") — orange text on white background did not meet the 4.5:1 ratio required for normal-sized text, because the heading had no font-size styling applied (rendering at default browser text size).

**Fix:** Added `text-4xl font-bold` to the heading. Large/bold text only requires a 3:1 contrast ratio under WCAG, which the existing orange comfortably clears — so increasing the visual size (which was also a real, independent UX improvement) resolved the failure without changing the brand color at all.

### After
| Metric | Score |
|---|---|
| Performance | 98 |
| Accessibility | **100** |
| Best Practices | 100 |
| SEO | 100 |

## Chat page (`/playground-chat`) — primary flow

### Before
| Metric | Score |
|---|---|
| Performance | 99 |
| Accessibility | 95 |
| Best Practices | 100 |
| SEO | 100 |

**Issue found:** Contrast failure on the "Send" button — white text on the standard `bg-accent` orange did not meet the 4.5:1 ratio required for button-sized text.

**Fix:** Added a new `--color-accent-dark` design token (`#c24a1a`, a darker shade of the same brand orange) and applied it specifically to the Send button, leaving the lighter accent color unchanged everywhere else in the app where it isn't failing contrast checks.

**AI-specific accessibility (per brief requirement 4):**
- Added `aria-live="polite"` and `aria-atomic="false"` to the message container, so screen readers announce new streamed assistant text as it arrives, without interrupting the user or re-reading the entire conversation history on every update.
- Confirmed the Stop button is a real `<button>` element, keyboard-focusable and activatable via Enter/Space (already true from earlier work, verified again here).

### After
| Metric | Score |
|---|---|
| Performance | 95 |
| Accessibility | **100** |
| Best Practices | 100 |
| SEO | 100 |

## Keyboard-only pass

Completed the full primary flow using only Tab, Enter, and typing — no mouse:
1. Tab to an example prompt button, Enter to send it
2. Received and read the assistant's response
3. Tab to the input field, typed a follow-up message
4. Tab to Send, Enter to submit

All steps completed successfully with no dead ends or unreachable controls.

## Summary of measurable deltas

| Page | Accessibility before | Accessibility after |
|---|---|---|
| Homepage | 95 | **100** (+5) |
| Chat page | 95 | **100** (+5) |

Both pages' Performance scores remained well above the 90 target throughout (95-99), so no performance-specific fixes were needed — only the two contrast issues required changes.
