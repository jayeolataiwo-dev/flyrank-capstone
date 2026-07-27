"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

export function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.role === "user" ? "You" : "Assistant"}: </strong>
            {message.parts.map((part, index) =>
              part.type === "text" ? <span key={index}>{part.text}</span> : null
            )}
          </div>
        ))}
      </div>

      {status === "submitted" && <p>Thinking...</p>}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your connection or plan..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}