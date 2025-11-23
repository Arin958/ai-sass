import { ChatSessions } from "@/components/chat/chat-session"


export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <ChatSessions />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}