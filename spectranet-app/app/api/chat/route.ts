import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { chatModel, systemPrompt } from "@/lib/ai-config";
import { tools } from "@/lib/chat-tools";

export const runtime = "edge";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

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