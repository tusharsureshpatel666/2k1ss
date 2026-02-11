"use client";

import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatHeaderSkeleton } from "@/app/loader/ChatHeaderLoader";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export default function ChatHeader({
  conversationId,
}: {
  conversationId: string;
}) {
  const [header, setHeader] = useState<{
    name: string;
    image: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) return;

    const fetchHeader = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/conversation/chatheader/${conversationId}`,
        );
        setHeader(res.data);
      } catch (error) {
        console.error("Header fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeader();
  }, [conversationId]);

  // ✅ Skeleton while loading
  if (loading) {
    return <ChatHeaderSkeleton />;
  }

  if (!header) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-b px-4 py-3 bg-white dark:bg-black">
      <div className="flex items-center gap-4">
        <Image
          src={header.image}
          alt={header.name}
          width={44}
          height={44}
          className="rounded-full object-cover"
        />

        <div>
          <p className="font-medium text-black dark:text-white">
            {header.name}
          </p>
        </div>
      </div>
      <div>
        <Button variant={"secondary"} className="rounded-full">
          <Phone className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
