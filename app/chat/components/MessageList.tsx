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

  // 1️⃣ Fetch messages
  useEffect(() => {
    if (!conversationId) return;

    setMessages([]);

    axios
      .get(`/api/message/${conversationId}`)
      .then((res) => setMessages(res.data));
  }, [conversationId]);

  // 2️⃣ Realtime updates
  useEffect(() => {
    if (!conversationId || !session?.user?.id) return;

    const channelName = `conversation-${conversationId}`;
    const channel = pusherClient.subscribe(channelName);

    channel.bind("new-message", (message: any) => {
      if (message.conversationId !== conversationId) return;

      setMessages((prev) => {
        // ✅ prevent duplicates
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });

    channel.bind("messages-seen", ({ seenBy }: { seenBy: string }) => {
      // ✅ mark messages as seen ONLY if I am NOT the sender
      if (seenBy !== session.user.id) {
        setMessages((prev) =>
          prev.map((m) =>
            m.senderId === session.user.id ? { ...m, seen: true } : m,
          ),
        );
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(channelName);
    };
  }, [conversationId, session?.user?.id]);

  // 3️⃣ Mark messages as seen ONCE
  useEffect(() => {
    if (!conversationId || messages.length === 0) return;

    axios.post("/api/message/seen", { conversationId });
  }, [conversationId]);

  // 4️⃣ Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.map((msg, index) => {
        const isMine = msg.senderId === session?.user?.id;
        const prev = messages[index - 1];
        const next = messages[index + 1];

        return (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            isMine={isMine}
            isFirst={!prev || prev.senderId !== msg.senderId}
            isLast={!next || next.senderId !== msg.senderId}
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
