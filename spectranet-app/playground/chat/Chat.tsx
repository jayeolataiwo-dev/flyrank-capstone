"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import type { ChatMessage } from "@/lib/chat-tools";

export function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop } =  useChat<ChatMessage>();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  }

  const isThinking = status === "submitted";
  const isStreaming = status === "streaming";

  function handleScroll() {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsAtBottom(distanceFromBottom < 50);
  }

  useEffect(() => {
    if (isAtBottom) {
      scrollContainerRef.current?.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
      });
    }
  }, [messages, isAtBottom]);

  function jumpToLatest() {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
    setIsAtBottom(true);
  }

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border rounded-lg relative">
    
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "flex justify-end"
                : "flex justify-start"
            }
          >
            <div
              className={
                message.role === "user"
                  ? "bg-accent text-white rounded-lg px-4 py-2 max-w-[80%]"
                  : "bg-gray-100 text-gray-900 rounded-lg px-4 py-2 max-w-[80%]"
              }
            >
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return <span key={index}>{part.text}</span>;
                }

                if (part.type === "tool-checkDataBalance") {
                  return (
                    <div key={index} className="mt-2">
                      {part.state === "input-streaming" && (
                        <div className="text-sm text-gray-400 italic">
                          Preparing to check your plan...
                        </div>
                      )}
                      {part.state === "input-available" && (
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span className="animate-pulse">●</span>
                          Checking your data balance...
                        </div>
                      )}
                      {part.state === "output-available" && (
                        <div className="bg-white border-2 border-accent rounded-lg p-4 max-w-xs">
                          <div className="text-xs text-gray-500 uppercase tracking-wide">
                            {part.output.planName}
                          </div>
                          <div className="text-2xl font-bold text-accent mt-1">
                            {part.output.dataUsedGB}GB{" "}
                            <span className="text-sm text-gray-400 font-normal">
                              / {part.output.dataTotalGB}GB used
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-accent h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (part.output.dataUsedGB / part.output.dataTotalGB) * 100
                                )}%`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            Renews in {part.output.daysUntilRenewal} days
                          </div>
                        </div>
                      )}
                      {part.state === "output-error" && (
                        <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-sm text-red-700">
                          Couldn't check your data balance right now. Please try again.
                        </div>
                      )}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 rounded-lg px-4 py-2">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {!isAtBottom && (
        <button
          onClick={jumpToLatest}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 bg-gray-800 text-white text-sm rounded-full px-3 py-1 shadow-lg"
        >
          Jump to latest ↓
        </button>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your connection or plan..."
          className="flex-1 border rounded-lg px-3 py-2"
          disabled={isStreaming}
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={stop}
            className="bg-red-500 text-white rounded-lg px-4 py-2"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            className="bg-accent text-white rounded-lg px-4 py-2"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}