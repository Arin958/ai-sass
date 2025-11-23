// app/api/chat/route.ts

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
    const { sessionId, messages } = validateChatRequest(body);

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

    // Create new chat if session does not exist
    if (!chatSession) {
      const title = messages[0]?.content?.slice(0, 40) || "New Chat";

      chatSession = await prisma.chatSession.create({
        data: {
          title,
          messages: messages as unknown as Prisma.InputJsonValue, // ✔ correct JSON type
          userId: dbUser.id,
        },
      });
    }

    // -----------------------------
    // 5. Merge previous + new messages
    // -----------------------------
    const previousMessages = parseDatabaseMessages(chatSession.messages);
    const history: ChatMessage[] = [...previousMessages, ...messages];

    // -----------------------------
    // 6. Generate AI reply
    // -----------------------------
    const aiReply = await generateChatReply(history);

    const updatedMessages: ChatMessage[] = [
      ...history,
      { role: "assistant", content: aiReply },
    ];

    // -----------------------------
    // 7. Save messages back to database
    // -----------------------------
    await prisma.chatSession.update({
      where: { id: chatSession.id },
      data: {
        messages: updatedMessages as unknown as Prisma.InputJsonValue, // ✔ fixed
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
