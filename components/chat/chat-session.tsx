"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, MessageSquare, Calendar } from "lucide-react"
import Link from "next/link"

interface ChatSession {
  id: string
  title: string
  updatedAt: string
  createdAt: string
}

export function ChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await fetch('/api/tools/chat')
        
        if (!response.ok) {
          throw new Error("Failed to load sessions")
        }

        const data = await response.json()
        setSessions(data.sessions || [])
      } catch (error) {
        console.error("Error loading sessions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSessions()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="w-80 border-r bg-background/95 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chat History</h2>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse p-3 rounded-lg bg-muted">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 border-r bg-background/95 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Chat History</h2>
        <Link href="/chat">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Chat
          </Button>
        </Link>
      </div>

      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No chat sessions yet</p>
              <p className="text-sm">Start a new conversation to begin</p>
            </div>
          ) : (
            sessions.map((session) => (
              <Link key={session.id} href={`/tools/chat?sessionId=${session.id}`}>
                <div className="p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{session.title}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(session.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}