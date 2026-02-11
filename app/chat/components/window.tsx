import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";

export default function Windows({ id }: { id: string }) {
  return (
    <div className="flex h-full flex-col bg-gray-100 dark:bg-black">
      <ChatHeader conversationId={id} />
      <MessageList conversationId={id} />
      <ChatInput conversationId={id} />
    </div>
  );
}
