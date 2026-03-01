"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { Message } from "@/lib/types";
import { motion } from "framer-motion";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSelectedAddress = async (): Promise<string | undefined> => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
        return accounts[0] || undefined;
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  };

  const sendMessage = async (content: string) => {
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const address = await getSelectedAddress();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, walletAddress: address }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", content: `Error: ${data.error}` },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] max-w-[1200px] mx-auto w-full bg-black">
      <div className="flex-1 h-full relative">
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
