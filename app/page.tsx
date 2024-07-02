"use client";

import { useChat } from "ai/react";
import { useEffect, useState, useRef } from "react";
import { FiSend } from "react-icons/fi";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [previousMessages, setPreviousMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function fetchMessages() {
      const response = await fetch(`/api/chat`);
      const data = await response.json();
      if (data) setPreviousMessages(data);
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const allMessages = [...previousMessages, ...messages];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 px-6">
        <h1 className="text-2xl font-bold">Chatbot assignment</h1>
      </header>

      <div className="flex-grow overflow-auto px-4 py-6">
        {allMessages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            } mb-4`}>
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                m.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}>
              <p className="whitespace-pre-wrap break-words">{m.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="bg-white border-t border-gray-200 px-4 py-4">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            className="flex-grow p-2 mr-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <FiSend size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
}

/*
"use client";

import { useChat } from "ai/react";
import { useEffect, useState } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [previousMessages, setPreviousMessages] = useState([]);
  useEffect(() => {
    async function fetchMessages() {
      const response = await fetch(`/api/chat`);
      const data = await response.json();
      if (data) setPreviousMessages(data);
    }
    fetchMessages();
  }, []);

  const allMessages = [...previousMessages, ...messages];

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto">
      {allMessages.map((m) => (
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

*/
