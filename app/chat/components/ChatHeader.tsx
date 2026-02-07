"use client";

import Image from "next/image";
import { Phone, Video } from "lucide-react";
import useSWR from "swr";
import axios from "axios";

type Owner = {
  id: string;
  name: string;
  image?: string;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function ChatHeader({
  conversationId,
}: {
  conversationId: string;
}) {
  const {
    data: owner,
    isLoading,
    error,
  } = useSWR<Owner>(
    conversationId ? `/api/conversation/chatowner/${conversationId}` : null,
    fetcher,
  );

  if (isLoading) {
    return (
      <div className="px-4 py-3 text-gray-400 bg-[#202c33]">Loading...</div>
    );
  }

  if (error || !owner) {
    return (
      <div className="px-4 py-3 text-red-400 bg-[#202c33]">
        Failed to load user
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-white dark:bg-black px-4 py-5">
      <div className="flex items-center gap-3">
        <Image
          src={owner.image || "/avatar.avif"}
          alt={owner.name}
          width={30}
          height={30}
          className="rounded-full"
        />
        <p className="font-medium text-white">{owner.name}</p>
      </div>

      <div className="flex gap-4 text-gray-300">
        <Video className="h-5 w-5 cursor-pointer hover:text-white" />
        <Phone className="h-5 w-5 cursor-pointer hover:text-white" />
      </div>
    </div>
  );
}
