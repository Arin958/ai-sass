import { ChatInterface } from "@/components/chat/chat-interface"

interface ChatPageProps {
  searchParams: {
    sessionId?: string
  }
}

export default function ChatPage({ searchParams }: ChatPageProps) {
  return <ChatInterface sessionId={searchParams.sessionId} />
}