'use client'; // Only if you're using App Router

import { useState } from 'react';
import { global } from 'styled-jsx/css';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);


  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = { sender: 'user', text: input };
  setMessages(prev => [...prev, userMessage]);
  setInput("");
  setLoading(true); // ⏳ Start loading

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });

    const usr_msg_inssertion = await fetch('/api/db_insertion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, source: 'user' })
    });

    const data = await res.json();
    const botMessage = { sender: 'bot', text: data.reply };

    const res_msg_inssertion = await fetch('/api/db_insertion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: data.reply, source: 'bot' })
    });

    setMessages(prev => [...prev, botMessage]);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    setLoading(false); // ✅ Stop loading
  }
};



  return (
    <div className="p-4 border rounded shadow w-full max-w-md">
      <div className="h-64 overflow-y-scroll mb-4 border p-2 bg-gray-100 rounded">
        {messages.map((msg, i) => (
          <div key={i} className={`my-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
        />
        <button onClick={sendMessage} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-r">
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

    </div>
  );
}
