"use client";

import { useEffect, useRef, useState } from "react";

type ButtonState = "idle" | "loading" | "success" | "error";

export function SendButton({
  outcome,
  disabled = false,
}: {
  outcome: "random" | "success" | "error";
  disabled?: boolean;
}) {
  const [state, setState] = useState<ButtonState>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  // Clean up any pending timeout if the component unmounts mid-animation.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleClick() {
    if (state === "loading" || disabled) return;

    // Cancel any stale pending resolution from a previous click, and
    // bump the request id so an old timeout firing late gets ignored.
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const thisRequestId = ++requestIdRef.current;

    setState("loading");

    const delay = 600 + Math.random() * 800; // 600-1400ms, feels "real"

    timeoutRef.current = setTimeout(() => {
      if (requestIdRef.current !== thisRequestId) return; // interrupted, ignore

      const willFail =
        outcome === "error" || (outcome === "random" && Math.random() < 0.2);

      if (willFail) {
        setState("error");
      } else {
        setState("success");
        timeoutRef.current = setTimeout(() => {
          if (requestIdRef.current !== thisRequestId) return;
          setState("idle");
        }, 1200);
      }
    }, delay);
  }

  const label =
    state === "idle"
      ? "Send"
      : state === "loading"
      ? ""
      : state === "success"
      ? ""
      : "Retry";

  return (
    <button
      onClick={handleClick}
      disabled={disabled || state === "loading"}
      aria-busy={state === "loading"}
      aria-live="polite"
      className={[
        "relative w-32 h-11 rounded-lg font-semibold text-sm",
        "transition-colors duration-200 ease-out",
        "motion-reduce:transition-none",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        state === "error"
          ? "bg-red-500 text-white hover:bg-red-600"
          : state === "success"
          ? "bg-green-600 text-white"
          : "bg-accent text-white hover:bg-accent/90",
        state === "error" ? "motion-safe:animate-[shake_0.4s_ease-in-out]" : "",
      ].join(" ")}
    >
      {/* Idle / Retry label */}
      <span
        className={[
          "absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out motion-reduce:transition-none",
          state === "idle" || state === "error"
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none",
        ].join(" ")}
      >
        {label}
      </span>

      {/* Loading spinner */}
      <span
        className={[
          "absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out motion-reduce:transition-none",
          state === "loading"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1 pointer-events-none",
        ].join(" ")}
      >
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full motion-safe:animate-spin" />
      </span>

      {/* Success checkmark */}
      <span
        className={[
          "absolute inset-0 flex items-center justify-center transition-all duration-250 ease-out motion-reduce:transition-none",
          state === "success"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75 pointer-events-none",
        ].join(" ")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}