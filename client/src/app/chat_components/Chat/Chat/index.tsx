import { ChatContainer, ChatHeader, MessageBar } from "..";

export default function Chat() {
  return (
    <div className="border-[var(--conversation-border)] border-l w-full bg-[var(--conversation-panel-background)] flex flex-col h-[100vh] z-10">
      <ChatHeader />
      <ChatContainer />
      <MessageBar />
    </div>
  );
}
