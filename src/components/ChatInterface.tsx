"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "@/lib/types";
import { MessageBubble } from "./MessageBubble";
import { LoadingSpinner } from "./LoadingSpinner";
import { CornerDownLeft } from "lucide-react";

interface ChatInterfaceProps {
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (message: string) => void;
}

export const ChatInterface = ({ messages, isLoading, onSendMessage }: ChatInterfaceProps) => {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        onSendMessage(input);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black mx-auto w-full relative border-x border-white/5">

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar relative z-0">
                <div className="max-w-3xl mx-auto w-full">
                    {messages.length === 0 ? (
                        <div className="flex flex-col justify-center h-full min-h-[50vh] opacity-90">
                            <h3 className="text-xl font-medium text-white mb-2 tracking-tight">E-SCAN OS</h3>
                            <p className="text-neutral-500 text-[14px] leading-relaxed max-w-md">
                                A streamlined terminal for Web3 analysis. Connect your wallet to query balances, or paste raw smart contract code for vulnerability detection.
                            </p>
                        </div>
                    ) : (
                        <div className="pb-4">
                            {messages.map((msg) => (
                                <MessageBubble key={msg.id} message={msg} />
                            ))}
                            {isLoading && (
                                <div className="mb-8 flex justify-start">
                                    <LoadingSpinner text="Analyzing..." />
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-black bottom-0 z-10 w-full border-t border-white/5">
                <form
                    onSubmit={handleSubmit}
                    className="relative flex items-end max-w-3xl mx-auto group"
                >
                    <div className="relative w-full border border-white/10 rounded-lg bg-[#0A0A0A] focus-within:border-white/30 transition-colors">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message E-SCAN..."
                            className="w-full bg-transparent py-3 pl-4 pr-12 text-[14px] text-neutral-200 placeholder-neutral-600 focus:outline-none resize-none min-h-[48px] max-h-[200px] custom-scrollbar"
                            rows={1}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 bottom-2 p-1.5 bg-white text-black rounded hover:bg-neutral-200 transition-colors disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center"
                        >
                            <CornerDownLeft className="w-4 h-4" />
                        </button>
                    </div>
                </form>
                <div className="text-center mt-3">
                    <p className="text-[11px] text-neutral-600 font-medium">
                        E-SCAN can make mistakes. Verify critical code analysis manually.
                    </p>
                </div>
            </div>
        </div>
    );
};
