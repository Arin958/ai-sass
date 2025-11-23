"use client"

import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

export function ChatMessage({ role, content, isStreaming = false }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn(
      "group relative flex items-start space-x-4 p-6",
      !isUser && "bg-muted/50"
    )}>
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
        isUser 
          ? "bg-background border-gray-300" 
          : "bg-primary border-primary text-primary-foreground"
      )}>
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
      
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold">
            {isUser ? "You" : "DeepSeek"}
          </span>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <p className="leading-relaxed whitespace-pre-wrap">
            {content}
            {isStreaming && (
              <span className="inline-block h-2 w-2 bg-current animate-pulse ml-1" />
            )}
          </p>
        </div>
      </div>
    </div>
  )
}