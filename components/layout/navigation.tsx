"use client";

import * as React from "react"
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  SignUpButton, 
  useAuth, 
  UserButton 
} from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";

export default function Navigation() {

  const {userId} = useAuth()
  return (
    <nav className="container mx-auto flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-r from-blue-600 to-purple-600">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AIStudio
        </span>
        <Badge variant="secondary" className="ml-2 hidden sm:flex">
          Beta
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <ModeToggle />

        {userId && (
          <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#5a3fe0] transition-colors">
            Tools
          </button>
        )}

        <SignedOut>
          <SignInButton
            mode="modal"
            fallbackRedirectUrl="/tools"  
          >
            <button className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium text-sm sm:text-base px-4 py-2 cursor-pointer">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton
            mode="modal"
            fallbackRedirectUrl="/tools" 
          >
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#5a3fe0] transition-colors">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
            afterSignOutUrl="/"
          />
        </SignedIn>
      </div>
    </nav>
  );
}
