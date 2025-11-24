"use client"

import { ChatSessions } from "@/components/chat/chat-session"
import { ChatProvider, useChat } from "@/context/chat-context"


export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ChatProvider>
      <ChatLayoutContent>{children}</ChatLayoutContent>
    </ChatProvider>
  )
}

function ChatLayoutContent({ children }: { children: React.ReactNode }) {
  const { isMobileMenuOpen, closeMobileMenu } = useChat()

  return (
    <div className="flex h-screen">
      <ChatSessions 
        isMobileOpen={isMobileMenuOpen} 
        onMobileClose={closeMobileMenu}
      />
      
      <div className="flex-1 min-w-0">
        {children}
      </div>
      
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  )
}