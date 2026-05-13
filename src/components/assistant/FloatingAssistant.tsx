"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, ChevronDown } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  { label: "Bugünü planla", text: "Bugünü planlamama yardım et. Hangi işe odaklanmalıyım?" },
  { label: "Günü kapat", text: "Günü kapatıyorum. Bugünü nasıl değerlendirirsin?" },
  { label: "Görevleri sadeleştir", text: "Aktif görev listemi sadeleştirmeme yardım et." },
];

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "chat", messages: updated }),
      });

      if (res.ok) {
        const data = await res.json() as { reply: string };
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Bir hata oluştu, tekrar dene." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Bağlantı hatası." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Bubble button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full
                     bg-[#111111] border border-[#2a2a2a] shadow-lg
                     flex items-center justify-center
                     hover:border-[#f5c518]/40 hover:bg-[#161616]
                     transition-all group"
          title="Asistana sor"
        >
          <Bot size={18} className="text-[#555555] group-hover:text-[#f5c518] transition-colors" strokeWidth={1.8} />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[340px] max-h-[520px]
                     bg-[#0e0e0e] border border-[#1f1f1f] rounded-2xl
                     shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 pt-3.5 pb-3 flex items-center justify-between border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <Bot size={13} className="text-[#f5c518]" strokeWidth={1.8} />
              <span className="text-[11px] uppercase tracking-widest text-[#555555] font-medium">
                Asistana sor
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#333333] hover:text-[#666666] transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Quick prompts — only when no messages */}
          {messages.length === 0 && (
            <div className="px-4 py-3 flex flex-col gap-1.5 border-b border-[#1a1a1a]">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => sendMessage(p.text)}
                  disabled={loading}
                  className="text-left text-xs text-[#555555] hover:text-[#888888]
                             px-3 py-2 rounded-lg bg-[#111111] border border-[#1a1a1a]
                             hover:border-[#2a2a2a] transition-all disabled:opacity-40"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5 min-h-0">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#1a1a1a] text-[#cccccc]"
                        : "bg-[#111111] border border-[#1a1a1a] text-[#888888]"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl px-3 py-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#333333] animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Show quick prompts again as small chips after conversation */}
              {!loading && messages.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => sendMessage(p.text)}
                      className="text-[10px] text-[#444444] hover:text-[#666666] px-2 py-1
                                 border border-[#1a1a1a] rounded-md transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 flex items-center gap-2 border-t border-[#1a1a1a]">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder="Görev yaz veya sor..."
              disabled={loading}
              className="flex-1 bg-[#111111] border border-[#1a1a1a] rounded-xl
                         px-3 py-2 text-xs text-[#888888] placeholder:text-[#333333]
                         outline-none focus:border-[#2a2a2a] disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-xl bg-[#111111] border border-[#1f1f1f]
                         flex items-center justify-center hover:border-[#f5c518]/30
                         disabled:opacity-30 transition-colors"
            >
              <Send size={12} className="text-[#555555]" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
