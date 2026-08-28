import React, { useState, useRef, useEffect } from 'react';
import { chatbotApi } from '../api/chatbotApi';
import { useAuth } from '../hooks/useAuth';
import { Bot, Send, User, Sparkles, AlertTriangle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isDemo?: boolean;
  provider?: string;
}

export const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello ${user?.name || 'there'}! I am your NutriMeasure AI assistant. I have reviewed your profile and daily intake progress. How can I help you plan your next meal or optimize your nutrition today?`
    }
  ]);

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMsgText = input.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsgText
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await chatbotApi.sendMessage(userMsgText);
      if (res.success) {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: res.data.response,
          isDemo: res.data.is_demo,
          provider: res.data.provider
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "I'm having trouble connecting to the AI assistant right now. Please try asking again in a moment."
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              NutriMeasure AI Assistant
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Context-Aware</span>
            </h2>
            <p className="text-[11px] text-gray-400">Injected with your latest BMI, remaining targets & meal logs</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 font-bold text-xs ${
              msg.sender === 'user' ? 'bg-gray-800' : 'bg-emerald-600'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-none space-y-2'
            }`}>
              {msg.isDemo && (
                <div className="flex items-center gap-1 text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md w-fit mb-1 border border-amber-200">
                  <AlertTriangle className="w-3 h-3 text-amber-600" /> Demo AI Assistant
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything (e.g. What should I eat for dinner to reach my protein goal?)"
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-2xl shadow-sm transition disabled:opacity-50 flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-gray-400 text-center mt-2">
          NutriMeasure AI provides estimated dietary guidance and is not a substitute for professional medical or dietary advice.
        </p>
      </div>
    </div>
  );
};
