"use client";

import { useParams } from "next/navigation";
import EmptyState from "../components/EmptyState";
import Windows from "../components/window";
import ChatPresence from "@/app/components/chatPresence";

const Page = () => {
  const params = useParams();
  const conversationId = params?.id as string | undefined;

  return (
    <div className="hidden lg:block w-full h-screen">
      {!conversationId ? <EmptyState /> : <Windows id={conversationId} />}
      <ChatPresence conversationId={conversationId} />
    </div>
  );
};

export default Page;
