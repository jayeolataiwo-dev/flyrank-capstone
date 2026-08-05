import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Chat } from "@/playground/chat/Chat";

// Mock the AI SDK's useChat hook entirely — tests must never call the
// real API. We control exactly what it returns per test.
const mockSendMessage = vi.fn();
const mockRegenerate = vi.fn();
const mockStop = vi.fn();

let mockMessages: any[] = [];
let mockStatus = "ready";
let mockError: Error | undefined = undefined;

vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: mockMessages,
    sendMessage: mockSendMessage,
    status: mockStatus,
    stop: mockStop,
    error: mockError,
    regenerate: mockRegenerate,
  }),
}));

beforeEach(() => {
  mockMessages = [];
  mockStatus = "ready";
  mockError = undefined;
  vi.clearAllMocks();
});

describe("Chat", () => {
  it("shows the empty state with example prompts when there are no messages", () => {
    render(<Chat />);
    expect(
      screen.getByText("Ask me about your connection, data plan, or account.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "How much data do I have left?" })
    ).toBeInTheDocument();
  });

  it("clicking an example prompt sends that message", async () => {
    const user = userEvent.setup();
    render(<Chat />);
    await user.click(
      screen.getByRole("button", { name: "My internet keeps disconnecting" })
    );
    expect(mockSendMessage).toHaveBeenCalledWith({
      text: "My internet keeps disconnecting",
    });
  });

  it("shows a thinking indicator while status is submitted (pending)", () => {
    mockStatus = "submitted";
    render(<Chat />);
    expect(screen.getByText("Thinking...")).toBeInTheDocument();
  });

  it("disables the input while status is streaming", () => {
    mockStatus = "streaming";
    render(<Chat />);
    expect(screen.getByPlaceholderText(/ask about your connection/i)).toBeDisabled();
  });

  it("shows a Stop button instead of Send while streaming", () => {
    mockStatus = "streaming";
    render(<Chat />);
    expect(screen.getByRole("button", { name: "Stop" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Send" })
    ).not.toBeInTheDocument();
  });

  it("shows a designed error state with a working retry when there's an error", async () => {
    mockError = new Error("Something broke");
    const user = userEvent.setup();
    render(<Chat />);

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/something broke/i)).toBeInTheDocument();

    const retryButton = screen.getByRole("button", {
      name: "Retry last message",
    });
    await user.click(retryButton);
    expect(mockRegenerate).toHaveBeenCalled();
  });

  it("renders a real card component for a completed tool result, not raw JSON", () => {
    mockMessages = [
      {
        id: "1",
        role: "assistant",
        parts: [
          {
            type: "tool-checkDataBalance",
            state: "output-available",
            output: {
              planName: "Spectranet Unlimited Home",
              dataUsedGB: 42.3,
              dataTotalGB: 100,
              daysUntilRenewal: 6,
            },
          },
        ],
      },
    ];
    render(<Chat />);

    expect(screen.getByText("Spectranet Unlimited Home")).toBeInTheDocument();
    expect(screen.getByText(/42\.3GB/)).toBeInTheDocument();
    expect(screen.getByText("Renews in 6 days")).toBeInTheDocument();
    // Confirms it's NOT just dumping raw JSON to the screen
    expect(screen.queryByText(/"planName"/)).not.toBeInTheDocument();
  });

  it("shows a designed error box (not a crash) when a tool result fails", () => {
    mockMessages = [
      {
        id: "1",
        role: "assistant",
        parts: [
          {
            type: "tool-checkDataBalance",
            state: "output-error",
          },
        ],
      },
    ];
    render(<Chat />);

    expect(
      screen.getByText(/unable to check your balance/i)
    ).toBeInTheDocument();
  });
});