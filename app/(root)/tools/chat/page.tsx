import { ChatInterface } from "@/components/chat/chat-interface";

export default async function ChatPage(props: { searchParams: Promise<{ sessionId?: string }> }) {
  const { sessionId } = await props.searchParams;

  return <ChatInterface sessionId={sessionId} />;
}
