"use client";

import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ChatHeader({
  conversationId,
}: {
  conversationId: string;
}) {
  const [header, setHeader] = useState<{
    name: string;
    image: string;
  } | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    axios
      .get(`/api/conversation/chatheader/${conversationId}`)
      .then((res) => setHeader(res.data));
  }, [conversationId]);

  if (!header) return null;

  return (
    <div className="flex items-center gap-3 border-b px-4 py-3 bg-white dark:bg-black">
      <Image
        src={header.image}
        alt={header.name}
        width={44}
        height={44}
        className="rounded-full object-cover"
      />

      <div>
        <p className="font-medium text-black dark:text-white">{header.name}</p>
      </div>
    </div>
  );
}
