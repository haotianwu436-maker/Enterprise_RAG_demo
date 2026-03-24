import { ChatTopBar } from "@/components/layout/TopBar";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default function ChatPage() {
  return (
    <>
      <ChatTopBar />
      <ChatWindow />
      <ChatInput />
    </>
  );
}
