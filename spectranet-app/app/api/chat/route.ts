import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { chatModel, systemPrompt } from "@/lib/ai-config";
import { tools } from "@/lib/chat-tools";

export const runtime = "edge";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// ── Simple in-memory rate limiting ──────────────────────────────
// This is a portfolio/demo project on a free API tier, so the goal
// isn't bulletproof production-grade limiting — it's stopping a
// stranger from casually draining the free Gemini quota by spamming
// this endpoint. Tracks request counts per IP, resets every minute.
// NOTE: this resets whenever the Edge function cold-starts, and
// doesn't share state across regions — acceptable for this project's
// scale, not appropriate for a real production API at volume.
const requestLog = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // max requests per IP per window
const WINDOW_MS = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestLog.get(ip);

  if (!entry || now > entry.resetAt) {
    requestLog.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count += 1;
  return false;
}

const MAX_MESSAGE_LENGTH = 2000; // characters, per message

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({
        error: "Too many requests. Please wait a moment and try again.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  // Reject absurdly long input before it ever reaches the model —
  // caps how much a single request can cost, regardless of rate limit.
  const lastMessage = messages[messages.length - 1];
  const textLength = lastMessage?.parts
    ?.filter((p) => p.type === "text")
    .reduce((sum, p) => sum + (p as { text: string }).text.length, 0) ?? 0;

  if (textLength > MAX_MESSAGE_LENGTH) {
    return new Response(
      JSON.stringify({
        error: `Message too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const result = streamText({
    model: chatModel,
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools,
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      if (error == null) return "Unknown error occurred.";
      if (typeof error === "string") return error;
      if (error instanceof Error) return error.message;
      return "Something went wrong.";
    },
  });
}