"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import clsx from "clsx";

export default function ConversationList() {
  const [conversations, setConversations] = useState<any[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // 🔥 extract conversationId from URL
  const activeConversationId = pathname?.split("/")[2];

  useEffect(() => {
    axios.get("/api/conversation/list").then((res) => {
      setConversations(res.data);
    });
  }, []);

  return (
    <div className="w-80 border-r bg-white dark:bg-black">
      {conversations.map((conv) => {
        const otherUser = conv.participants.find(
          (p: any) => p.user.id !== session?.user?.id,
        )?.user;

        const isActive = conv.id === activeConversationId;

        return (
          <>
            <h2 className="text-xl px-5 py-7">Select Chat</h2>
            <div
              key={conv.id}
              onClick={() => router.push(`/chat/${conv.id}`)}
              className={clsx(
                "flex cursor-pointer items-center gap-3 px-4 py-3 transition",
                isActive
                  ? "dark:bg-gray-900 bg-gray-100"
                  : "hover:bg-[#202c33]",
              )}
            >
              <Image
                src={otherUser?.image || "/avatar.avif"}
                alt={otherUser?.name || "user"}
                width={40}
                height={40}
                className="rounded-full"
              />

              <div className="flex-1 min-w-0">
                <p className="font-medium text-black dark:text-white">
                  {otherUser?.name}
                </p>

                <p className="text-sm text-gray-400 truncate">
                  {conv.messages[0]?.text || "No messages yet"}
                </p>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}
