"use client"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { ModeToggle } from "../mode-toggle"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useChat } from "@/context/chat-context"

export interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatInterfaceProps {
  sessionId?: string
  onMobileMenuToggle?: () => void
}

export function ChatInterface({ sessionId }: ChatInterfaceProps) {
  const router = useRouter()
    const { toggleMobileMenu } = useChat() 
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
        setMessages([])
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
          router.push("/tools/chat")
          return
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
  }, [currentSessionId, router])

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
      
      if (!currentSessionId && data.sessionId) {
        setCurrentSessionId(data.sessionId)
      }
      
      setMessages(data.messages || [])
    } catch (error) {
      console.error("Error sending message:", error)
      
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
      {/* Header - Fixed at top with integrated menu button */}
      <div className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Left Section with Menu Button */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle Button */}
         
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleMobileMenu}
                className="lg:hidden mr-1 h-9 w-9 p-0 shrink-0"
                aria-label="Toggle chat history"
              > 
                <Menu className="h-4 w-4" />
              </Button>
        
            
            {/* Logo/Brand */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm flex-shrink-0">
              <span className="text-base font-bold text-primary-foreground">
                N
              </span>
            </div>

            {/* Title and Status */}
            <div className="flex flex-col leading-tight min-w-0">
              <h1 className="text-lg font-semibold tracking-tight truncate">
                NovaChat
              </h1>
              <p className="text-xs text-muted-foreground truncate">
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
              <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-full">
                <div className="text-center space-y-4 max-w-md">
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-2xl font-bold text-primary">N</span>
                    </div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">Welcome to NovaChat</h2>
                  <p className="text-muted-foreground text-sm sm:text-base">
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