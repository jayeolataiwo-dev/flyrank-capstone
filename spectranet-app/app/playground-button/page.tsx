import { SendButton } from "@/playground/button/SendButton";

export default function ButtonPlaygroundPage() {
  return (
    <main className="max-w-xl mx-auto py-16 px-6">
      <h1 className="text-xl font-bold mb-2">Send Button — Motion States</h1>
      <p className="text-gray-500 text-sm mb-8">
        A Send button for the Spectranet support chat, built to communicate
        its full lifecycle (idle → loading → success/error → idle) through
        motion, not abrupt swaps.
      </p>

      <div className="flex flex-wrap gap-6 items-center mb-10">
        <div className="flex flex-col items-center gap-2">
          <SendButton outcome="random" />
          <span className="text-xs text-gray-400">Random (20% fail)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SendButton outcome="success" />
          <span className="text-xs text-gray-400">Forced success</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SendButton outcome="error" />
          <span className="text-xs text-gray-400">Forced error</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SendButton outcome="success" disabled />
          <span className="text-xs text-gray-400">Disabled</span>
        </div>
      </div>

      <section className="text-sm text-gray-600 border-t pt-6">
        <h2 className="font-semibold text-gray-900 mb-2">
          Duration &amp; easing choices
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            State crossfades (idle/spinner/checkmark): 200ms, ease-out —
            fast enough to feel responsive, slow enough to read as
            intentional rather than a flicker.
          </li>
          <li>
            Success checkmark: 250ms with a scale from 0.75→1 (a subtle
            "pop" rather than a flat fade), held for 1200ms before
            auto-returning to idle.
          </li>
          <li>
            Error shake: 400ms, gated behind <code>motion-safe</code> —
            skipped entirely under <code>prefers-reduced-motion</code>,
            where the red color alone communicates the error so feedback
            is never lost, only the motion is.
          </li>
          <li>
            Layout stays fixed-width throughout; only <code>transform</code>{" "}
            and <code>opacity</code> animate, avoiding layout thrash.
          </li>
          <li>
            Rapid re-clicks are handled with a request-id counter, so a
            stale timeout from an interrupted click can never overwrite a
            newer one's state.
          </li>
        </ul>
      </section>
    </main>
  );
}