import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma/client";

import { validateChatRequest } from "@/lib/validation/chat";
import { generateChatReply } from "@/lib/generateWithAi";

export type ChatMessageRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

type UnknownMessage = {
  role?: unknown;
  content?: unknown;
};

/**
 * Safely parses stored JSON messages into ChatMessage[]
 */
function parseDatabaseMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return [];

  return messages
    .map((msg) => {
      // Ensure msg is an object
      if (typeof msg !== "object" || msg === null) return null;

      const m = msg as UnknownMessage;

      // Validate role
      if (m.role !== "user" && m.role !== "assistant") return null;

      // Validate content
      if (typeof m.content !== "string") return null;

      return {
        role: m.role,
        content: m.content,
      };
    })
    .filter((msg): msg is ChatMessage => msg !== null);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // -----------------------------
    // 1. Verify authenticated user
    // -----------------------------
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // -----------------------------
    // 2. Validate incoming request
    // -----------------------------
    const body = await request.json();
    const { sessionId, messages: newMessages } = validateChatRequest(body);

    // -----------------------------
    // 3. Fetch DB user
    // -----------------------------
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // -----------------------------
    // 4. Get or create chat session
    // -----------------------------
    let chatSession = sessionId
      ? await prisma.chatSession.findUnique({
          where: { id: sessionId, userId: dbUser.id },
        })
      : null;

    // ---------------------------------------------------------
    // ⭐ CHANGED: SMART CHAT TITLE GENERATION
    // ---------------------------------------------------------
    if (!chatSession) {
      let rawTitle = newMessages[0]?.content || "New Chat";

      // ⭐ If first message is short like "hi", try next message
      if (rawTitle.length < 12) {
        rawTitle = newMessages[1]?.content || rawTitle;
      }

      // ⭐ Pre-trim extract
      let title = rawTitle.slice(0, 60);

      // ⭐ Try generating a clean topic title via AI
      try {
        const aiTitle = await generateChatReply([
          {
            role: "user",
            content: `Create a short (max 6 words) concise chat title summarizing: "${rawTitle}"`,
          },
        ]);

        if (aiTitle) {
          title = aiTitle.replace(/[".]/g, "").trim();
        }
      } catch (err) {
        console.warn("AI title generation failed:", err);
      }

      // ⭐ Create new chat session with improved title
      chatSession = await prisma.chatSession.create({
        data: {
          title,
          messages: newMessages as unknown as Prisma.InputJsonValue,
          userId: dbUser.id,
        },
      });
    }

    // -----------------------------
    // 5. Merge previous + new messages
    // -----------------------------
    const previousMessages = parseDatabaseMessages(chatSession.messages);

    const lastPreviousMessage = previousMessages[previousMessages.length - 1];
    const firstNewMessage = newMessages[0];

    let history: ChatMessage[];

    if (
      lastPreviousMessage &&
      firstNewMessage &&
      lastPreviousMessage.role === firstNewMessage.role &&
      lastPreviousMessage.content === firstNewMessage.content
    ) {
      history = previousMessages;
    } else {
      history = [...previousMessages, ...newMessages];
    }

    // -----------------------------
    // 6. Generate AI reply
    // -----------------------------
    const aiReply = await generateChatReply(history);

    const updatedMessages: ChatMessage[] = [
      ...history,
      { role: "assistant", content: aiReply },
    ];

    // ---------------------------------------------------------
    // ⭐ OPTIONAL IMPROVEMENT:
    // AUTO-UPDATE TITLE AFTER FIRST REAL TOPIC MESSAGE
    // ---------------------------------------------------------
    if (previousMessages.length === 0) {
      // Update title when assistant sends first answer
      try {
        const newTitle = await generateChatReply([
          {
            role: "user",
            content: `Generate a short (4–7 word) topic title for this conversation: "${updatedMessages
              .map((m) => m.content)
              .join(" ")}"`,
          },
        ]);

        if (newTitle) {
          await prisma.chatSession.update({
            where: { id: chatSession.id },
            data: {
              title: newTitle.replace(/[".]/g, "").trim(),
            },
          });
        }
      } catch (e) {
        console.log("Failed to auto-update title:", e);
      }
    }

    // -----------------------------
    // 7. Save messages back to database
    // -----------------------------
    await prisma.chatSession.update({
      where: { id: chatSession.id },
      data: {
        messages: updatedMessages as unknown as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
    });

    // -----------------------------
    // 8. Return successful response
    // -----------------------------
    return NextResponse.json({
      sessionId: chatSession.id,
      reply: aiReply,
      messages: updatedMessages,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // -----------------------------
    // 1. Verify authenticated user
    // -----------------------------
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // -----------------------------
    // 2. Fetch DB user
    // -----------------------------
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // -----------------------------
    // 3. Get session ID from query params
    // -----------------------------
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      // Fetch specific chat session
      const chatSession = await prisma.chatSession.findUnique({
        where: { 
          id: sessionId, 
          userId: dbUser.id 
        },
      });

      if (!chatSession) {
        return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
      }

      const messages = parseDatabaseMessages(chatSession.messages);

      return NextResponse.json({
        sessionId: chatSession.id,
        messages,
        title: chatSession.title,
      });
    } else {
      // Fetch all chat sessions for the user
      const chatSessions = await prisma.chatSession.findMany({
        where: { userId: dbUser.id },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          updatedAt: true,
          createdAt: true,
        },
      });

      return NextResponse.json({
        sessions: chatSessions,
      });
    }
  } catch (error) {
    console.error("Chat API GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}