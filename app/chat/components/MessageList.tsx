"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import MessageBubble from "./ChatBubble";
import { pusherClient } from "@/lib/pusher/client";

export default function MessageList({
  conversationId,
}: {
  conversationId: string;
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const { data: session } = useSession();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initial fetch
  useEffect(() => {
    if (!conversationId) return;

    axios
      .get(`/api/message/${conversationId}`)
      .then((res) => setMessages(res.data));
  }, [conversationId]);

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = pusherClient.subscribe(`conversation-${conversationId}`);

    channel.bind("new-message", (message: any) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`conversation-${conversationId}`);
    };
  }, [conversationId]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    axios.post("/api/message/seen", { conversationId });
    const channel = pusherClient.subscribe(`conversation-${conversationId}`);
    channel.bind("messages-seen", () => {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === session?.user?.id ? { ...m, seen: true } : m,
        ),
      );
    });
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-black px-4 py-4">
      {messages.map((msg, index) => {
        const isMine = msg.senderId === session?.user?.id;

        const prev = messages[index - 1];
        const next = messages[index + 1];

        const isFirst = !prev || prev.senderId !== msg.senderId;
        const isLast = !next || next.senderId !== msg.senderId;

        return (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            isMine={isMine}
            isFirst={isFirst}
            isLast={isLast}
            seen={msg.seen}
            time={new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
