"use client";

import { useEffect, useRef, useState } from "react";

type ButtonState = "idle" | "loading" | "success" | "error";

export function SendButton({
  outcome,
  disabled = false,
  idleLabel = "Send",
}: {
  outcome: "random" | "success" | "error";
  disabled?: boolean;
  idleLabel?: string;
}) {
  const [state, setState] = useState<ButtonState>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleClick() {
    if (state === "loading" || disabled) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const thisRequestId = ++requestIdRef.current;

    setState("loading");

    const delay = 600 + Math.random() * 800;

    timeoutRef.current = setTimeout(() => {
      if (requestIdRef.current !== thisRequestId) return;

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
      ? idleLabel
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
          : "bg-accent-dark text-white hover:bg-accent",
        state === "error" ? "motion-safe:animate-[shake_0.4s_ease-in-out]" : "",
      ].join(" ")}
    >
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