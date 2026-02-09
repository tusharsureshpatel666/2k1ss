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

  const activeConversationId = pathname?.split("/")[2];

  useEffect(() => {
    axios.get("/api/conversation/list").then((res) => {
      setConversations(res.data);
    });
  }, []);

  return (
    <div className="w-80 border-r bg-white dark:bg-black">
      {conversations.map((conv) => {
        const isOwner = conv.store.ownerId === session?.user?.id;

        // 🔑 decide other side
        const other = isOwner
          ? {
              name: conv.buyer?.name || "Buyer",
              image: conv.buyer?.image || "/avatar.avif",
            }
          : {
              name: conv.store?.title || "Store",
              image: conv.store.bannerImageUrl, // static store avatar
            };

        const isActive = conv.id === activeConversationId;

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
            <Image
              src={other.image}
              alt={other.name}
              width={40}
              height={40}
              className="rounded-full"
            />

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
