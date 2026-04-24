"use client";

import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export const MessageBubble = ({ message }: { message: Message }) => {
    const isUser = message.role === "user";

    return (
        <div className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}>
            <div className={cn("flex max-w-[85%] sm:max-w-[70%] items-start gap-4", isUser ? "flex-row-reverse" : "flex-row")}>
                <div className={cn("flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-sm font-medium text-xs", isUser ? "bg-white text-black" : "bg-[#111] border border-white/10 text-white")}>
                    {isUser ? "US" : "ES"}
                </div>
                <div
                    className={cn(
                        "py-1.5 px-0 whitespace-pre-wrap text-[14px] leading-relaxed markdown-content",
                        isUser ? "text-neutral-200" : "text-neutral-300"
                    )}
                >
                    {isUser ? message.content : (
                        <ReactMarkdown>
                            {message.content}
                        </ReactMarkdown>
                    )}
                </div>
            </div>
        </div>
    );
};
