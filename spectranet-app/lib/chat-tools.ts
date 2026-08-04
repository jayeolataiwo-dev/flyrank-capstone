/**
 * Tool definitions for the Spectranet Support Assistant chat.
 *
 * Kept separate from ai-config.ts so the tool contract (schema + return
 * shape) is easy to find and document independently of the model/prompt
 * config. See README.md for the documented contract.
 */

import { tool, type InferUITools, type UIDataTypes, type UIMessage } from "ai";
import { z } from "zod";
export const tools = {
  checkDataBalance: tool({
    description:
      "Check the user's current mock data plan balance and renewal date. Use this whenever the user asks about their data, plan, or usage.",

    inputSchema: z.object({}),

    execute: async () => {
      // Simulate a network request so the loading skeleton is visible.
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data only — this is a demo, not a real account lookup.
      return {
        planName: "Spectranet Unlimited Home",
        dataUsedGB: 42.3,
        dataTotalGB: 100,
        daysUntilRenewal: 6,
      };
    },
  }),
};

// Type helpers so the client (Chat.tsx) knows the exact shape of this
// tool's input/output, instead of TypeScript falling back to `unknown`.
export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;