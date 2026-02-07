"use client";
import { usePathname } from "next/navigation";
import { useConversation } from "./useConversation";
import { useMemo } from "react";
import { HiChatBubbleOvalLeft } from "react-icons/hi2";
import { FaUserAlt } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { signOut } from "next-auth/react";

export const useRoutes = () => {
  const pathName = usePathname();
  const { conversationId } = useConversation();
  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/chat/conversation",
        icon: HiChatBubbleOvalLeft,
        active: pathName === "/chat/conversation" || !!conversationId,
      },
      {
        label: "Users",
        href: "/chat",
        icon: FaUserAlt,
        active: pathName === "/chat",
      },
      {
        label: "Logout",
        href: "/#",
        onClick: () => signOut(),
        icon: IoLogOut,
      },
    ],

    [pathName, conversationId],
  );
  return routes;
};
