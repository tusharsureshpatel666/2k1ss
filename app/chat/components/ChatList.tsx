"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { pusherClient } from "@/lib/pusher/client";
import { ConversationSkeleton } from "@/app/loader/ChatListLoader";

export default function ConversationList() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [onlineMap, setOnlineMap] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const activeConversationId = pathname?.split("/")[2];

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get("/api/conversation/list");
        setConversations(res.data);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    const channel = pusherClient.subscribe("presence-global");

    channel.bind("user-online", (data: { userId: string }) => {
      setOnlineMap((prev) => ({
        ...prev,
        [data.userId]: true,
      }));
    });

    channel.bind("user-offline", (data: { userId: string }) => {
      setOnlineMap((prev) => ({
        ...prev,
        [data.userId]: false,
      }));
    });
    return () => {
      pusherClient.unsubscribe("presence-global");
    };
  }, []);

  // 🔴 check presence
  useEffect(() => {
    conversations.forEach((conv) => {
      const isOwner = conv.store.ownerId === session?.user?.id;

      const otherUserId = isOwner ? conv.buyerId : conv.store.ownerId;

      if (!otherUserId) return;

      axios.get(`/api/presence/status?userId=${otherUserId}`).then((res) => {
        setOnlineMap((prev) => ({
          ...prev,
          [otherUserId]: res.data.online,
        }));
      });
    });
  }, [conversations, session?.user?.id]);

  return (
    <div className="lg:w-80 md:w-full w-full border-r bg-white dark:bg-black">
      <h1 className="text-xl px-3 py-5">Chats</h1>
      {loading
        ? Array.from({ length: 8 }).map((_, i) => (
            <ConversationSkeleton key={i} />
          ))
        : conversations.map((conv) => {
            const isOwner = conv.store.ownerId === session?.user?.id;

            const other = isOwner
              ? {
                  id: conv.buyerId,
                  name: conv.buyer?.name || "Buyer",
                  image: conv.buyer?.image || "/avatar.avif",
                }
              : {
                  id: conv.store.ownerId,
                  name: conv.store?.title || "Store",
                  image: conv.store.bannerImageUrl,
                };

            const isActive = conv.id === activeConversationId;
            const isOnline = onlineMap[other.id];

            return (
              <div
                key={conv.id}
                onClick={() => router.push(`/chat/${conv.id}`)}
                className={clsx(
                  "flex cursor-pointer items-center gap-3 px-4 py-3 transition",
                  isActive
                    ? "bg-gray-100 dark:bg-gray-900"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                {/* Avatar + Online dot */}
                <div className="relative">
                  <Image
                    src={other.image}
                    alt={other.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />

                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-black dark:text-white truncate">
                    {other.name}
                  </p>

                  <p className="text-sm text-gray-400 truncate">
                    {conv.messages[0]?.text || "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })}
    </div>
  );
}
