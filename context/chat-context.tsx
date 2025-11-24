"use client"

import React, { createContext, useContext, useState } from 'react'

interface ChatContextType {
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <ChatContext.Provider value={{ isMobileMenuOpen, toggleMobileMenu, closeMobileMenu }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}