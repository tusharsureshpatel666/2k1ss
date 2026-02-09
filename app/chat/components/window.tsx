import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";

export default function Windows({ id }) {
  return (
    <div className="flex h-full flex-col bg-gray-100 dark:bg-gray-900">
      <ChatHeader conversationId={id} />
      <MessageList conversationId={id} />
      <ChatInput conversationId={id} />
    </div>
  );
}
