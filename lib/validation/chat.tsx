// types/chat.ts
export type ChatMessageRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRequest {
  sessionId?: string;
  messages: ChatMessage[];
}

export interface ChatResponse {
  sessionId: string;
  reply: string;
  messages: ChatMessage[];
}



export function isValidChatMessage(obj: unknown): obj is ChatMessage {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "role" in obj &&
    "content" in obj &&
    (obj.role === "user" || obj.role === "assistant") &&
    typeof obj.content === "string" &&
    obj.content.trim().length > 0
  );
}

export function parseChatMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) {
    throw new Error("Messages must be an array");
  }

  return messages.map((msg, index) => {
    if (!isValidChatMessage(msg)) {
      throw new Error(`Invalid message format at index ${index}`);
    }
    return {
      role: msg.role,
      content: msg.content.trim(),
    };
  });
}

export function validateChatRequest(body: unknown): { sessionId?: string; messages: ChatMessage[] } {
  if (typeof body !== "object" || body === null) {
    throw new Error("Request body must be an object");
  }

  const { sessionId, messages } = body as { sessionId?: unknown; messages: unknown };

  // Validate sessionId
  if (sessionId !== undefined && typeof sessionId !== "string") {
    throw new Error("Session ID must be a string");
  }

  // Validate messages
  const parsedMessages = parseChatMessages(messages);
  
  if (parsedMessages.length === 0) {
    throw new Error("At least one message is required");
  }

  if (parsedMessages.length > 50) {
    throw new Error("Too many messages (maximum 50)");
  }

  return {
    sessionId,
    messages: parsedMessages,
  };
}