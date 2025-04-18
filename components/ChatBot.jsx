'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../app/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chatList, setChatList] = useState([]);

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error) {
        const formatted = data.map(msg => ({
          sender: msg.source,
          text: msg.message
        }));
        setMessages(formatted);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (loading) return;


    try {

      if (!chatId) {
        const id = uuidv4();;
        setChatId(id);
        setChatList(prev => [...prev, { id, title: input.slice(0, 30)+'...' }]);
      }

      const userMessage = { sender: 'user', text: input, chatId: chatId };
      setMessages(prev => [...prev, userMessage]);
      setInput("");
      setLoading(true);

      await fetch('/api/db_insertion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, source: 'user', chatId: chatId })
      });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const botMessage = { sender: 'bot', text: data.reply,  chatId: chatId  };

      await fetch('/api/db_insertion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: data.reply, source: 'bot',  chatId: chatId  })
      });

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    await fetch('/api/clear_chat', { method: 'POST' });
    setMessages([]);
  };

  const startNewChat = () => {
    setChatId(null);
    setMessages([]);
    setInput('');
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 p-4 bg-[#0f1124] flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold mb-4">Chats</h2>
          <button
            onClick={startNewChat}
            className="mb-4 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            + New Chat
          </button>
          <ul className="text-sm text-gray-300 space-y-2">
            {chatList.length === 0 ? (
              <li>No chats yet.</li>
            ) : (
              chatList.map(chat => (
                <li key={chat.id} className="hover:underline cursor-pointer">
                  {chat.title}
                </li>
              ))
            )}
          </ul>
        </div>
        <button onClick={clearChat} className="mt-4 py-2 bg-red-600 hover:bg-red-700 rounded">Clear Chat</button>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col p-4 bg-gray-100 overflow-hidden">
        {/* Message Area */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`w-fit max-w-[70%] px-4 py-2 rounded-lg break-words ${msg.sender === 'user'
                ? 'ml-auto bg-gray-200 text-black text-right'
                : 'mr-auto bg-white text-black shadow'
                }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 text-gray-800 p-3 border rounded-lg"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
