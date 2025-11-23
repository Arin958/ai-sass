"use client"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { ModeToggle } from "../mode-toggle"
import { useRouter } from "next/navigation"

export interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatInterfaceProps {
  sessionId?: string
}

export function ChatInterface({ sessionId }: ChatInterfaceProps) {
   const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [currentSessionId, setCurrentSessionId] = useState(sessionId)
  const scrollViewportRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat history when component mounts or sessionId changes
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!currentSessionId) {
        setIsLoadingHistory(false)
        return
      }

      try {
        setIsLoadingHistory(true)
        const response = await fetch(`/api/tools/chat?sessionId=${currentSessionId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        
         if (!response.ok) {
        // If session is invalid → redirect
        router.push("/tools/chat");
        return;
      }

        const data = await response.json()
        setMessages(data.messages || [])
      } catch (error) {
        console.error("Error loading chat history:", error)
        setMessages([])
      } finally {
        setIsLoadingHistory(false)
      }
    }

    loadChatHistory()
  }, [currentSessionId])

  useEffect(() => {
    setCurrentSessionId(sessionId)
  }, [sessionId])

  // Auto-scroll to bottom when messages change or when loading state changes
  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, isLoadingHistory])

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: "smooth",
          block: "nearest"
        })
      }
    }, 100)
  }

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: "user", content }
    
    // Don't add to state yet - wait for API response
    setIsLoading(true)

    try {
      const response = await fetch("/api/tools/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: currentSessionId,
          messages: [userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()
      
      // Update session ID if this is a new session
      if (!currentSessionId && data.sessionId) {
        setCurrentSessionId(data.sessionId)
      }
      
      // Use the messages returned from the API
      setMessages(data.messages || [])
    } catch (error) {
      console.error("Error sending message:", error)
      
      // Add error message only if API fails
      setMessages(prev => [...prev, userMessage, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingHistory) {
    return (
      <div className="flex flex-col h-screen bg-background items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading chat history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header - Fixed at top */}
   <div className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-xl">
  <div className="flex h-16 items-center justify-between px-6">

    {/* Left Section */}
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm">
        <span className="text-base font-bold text-primary-foreground">
          N
        </span>
      </div>

      <div className="flex flex-col leading-tight">
        <h1 className="text-lg font-semibold tracking-tight">
          NovaChat
        </h1>
        <p className="text-xs text-muted-foreground">
          {currentSessionId ? "Continuing conversation…" : "Start a new conversation"}
        </p>
      </div>
    </div>

    {/* Right Section */}
    <div className="flex items-center gap-2">
      <ModeToggle />
    </div>
  </div>
</div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col min-h-full">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8 min-h-full">
                <div className="text-center space-y-4 max-w-md">
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-2xl font-bold text-primary">N</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold">Welcome to NovaChat</h2>
                  <p className="text-muted-foreground">
                    Start a conversation by typing a message below. I&apos;m here to help with your questions!
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    role={message.role}
                    content={message.content}
                    isStreaming={isLoading && index === messages.length - 1 && message.role === "assistant"}
                  />
                ))}
                {/* Invisible element at the end for scrolling */}
                <div ref={messagesEndRef} className="h-4" />
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="shrink-0 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="p-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  )
}