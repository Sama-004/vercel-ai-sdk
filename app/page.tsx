"use client";

import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`whitespace-pre-wrap mb-5 border p-2 ${
            m.role === "user" ? "ml-auto bg-blue-100" : "mr-auto bg-gray-100"
          }`}>
          <div className={m.role === "user" ? "text-right" : ""}>
            {m.content}
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
