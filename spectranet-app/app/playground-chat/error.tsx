"use client";

// Next.js requires error.tsx to be a Client Component, and it must
// receive exactly these two props: the thrown error, and a reset
// function that attempts to re-render the route from scratch.

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center px-6">
      <h1 className="text-lg font-semibold text-gray-900 mb-2">
        Something broke on this page
      </h1>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">
        The support chat ran into an unexpected problem. This is separate
        from a failed message — the whole page needs a fresh start.
      </p>
      <button
        onClick={reset}
        className="bg-accent text-white rounded-lg px-4 py-2 text-sm font-semibold"
      >
        Try again
      </button>
    </main>
  );
}