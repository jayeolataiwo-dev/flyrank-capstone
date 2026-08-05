import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SendButton } from "@/playground/button/SendButton";

afterEach(() => {
  vi.useRealTimers();
});

describe("SendButton", () => {
  it("shows 'Send' label in the idle state", () => {
    render(<SendButton outcome="success" />);
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("becomes disabled while loading, then shows success", async () => {
    const user = userEvent.setup();
    render(<SendButton outcome="success" />);

    const button = screen.getByRole("button", { name: "Send" });
    await user.click(button);

    // Immediately after click, it should be disabled (loading state)
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    // Eventually resolves to success (aria-busy goes false)
    await waitFor(
      () => {
        expect(button).toHaveAttribute("aria-busy", "false");
      },
      { timeout: 3000 }
    );
  });

  it("shows a Retry label after a forced error", async () => {
    const user = userEvent.setup();
    render(<SendButton outcome="error" />);

    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(
      () => {
        expect(
          screen.getByRole("button", { name: "Retry" })
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("respects the disabled prop and never becomes clickable", async () => {
    const user = userEvent.setup();
    render(<SendButton outcome="success" disabled />);

    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toBeDisabled();

    await user.click(button);
    // Still idle/disabled — click should have no effect
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "false");
  });
});