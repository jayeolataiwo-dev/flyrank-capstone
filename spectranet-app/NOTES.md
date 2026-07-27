# NOTES.md — Comparing my hand-built components to shadcn/ui

## Modal vs shadcn's Dialog

**Gap 1: No backdrop/overlay**
My `Modal.tsx` renders its content with no visual separation from the page behind it. shadcn's `DialogOverlay` adds a dimmed background (`bg-black/10`) whenever the dialog is open. This isn't just visual polish — it reinforces for sighted users that the background is inactive, matching what the focus trap already does for keyboard users. I missed this entirely.

**Gap 2: Focus trap and Escape handling are invisible in shadcn's source**
My version needed about 30 lines of hand-written logic: refs for the dialog and both buttons, a keydown listener, manual index math to cycle focus, and a `requestAnimationFrame` workaround to fix a focus-timing bug. None of that logic appears anywhere in shadcn's `dialog.tsx` — it's handled entirely inside Radix's `DialogPrimitive.Content`, hidden from the file I read. Building it myself first showed me exactly how much complexity that hides, and why getting it right by hand took real debugging.

**Gap 3: Uses a Portal**
shadcn wraps its dialog content in `DialogPortal`, which renders the dialog's HTML elsewhere in the actual DOM (typically near `</body>`) instead of exactly where the component sits in the tree. My version renders inline, which risks z-index stacking issues or a parent container clipping the modal — something I hadn't considered until reading this.

## What I got right on my own

- Correct `role="dialog"` and `aria-modal="true"`
- A working focus trap (Tab/Shift+Tab cycle correctly, verified by testing)
- Escape closes the modal
- Focus returns to the trigger button on close

## Reflection

Building the modal by hand first meant I actually understood _why_ Radix's internal focus-trap logic needs to exist, instead of it being unfamiliar library magic. The backdrop overlay and portal are things I wouldn't have known to ask for if I'd started with shadcn first — they're not obvious until you see a real implementation that includes them.

## Tabs vs shadcn's Tabs

**Gap 4: ARIA roles and arrow-key logic are hidden inside Radix, same as Dialog**
Just like the Dialog, nothing in `tabs.tsx` shows `role="tab"`, `aria-selected`, or any keydown/arrow-key handling — it's all inside `TabsPrimitive` from Radix. I had to write the roving `tabIndex` pattern, a `useEffect` to move focus after state updates, and the wraparound math (`% tabs.length`) by hand — and hit a real bug where focus got stuck until I added the `useEffect`.

**Gap 5: Explicit focus-visible styling**
shadcn defines `focus-visible:ring-[3px] focus-visible:ring-ring/50` directly in its className. My components never defined any focus styling — this connects to a real issue I hit while testing my Modal, where the dialog div was correctly focused (the trap logic worked) but showed no visible outline, because plain divs don't get a default browser focus ring. shadcn doesn't leave this to chance.
