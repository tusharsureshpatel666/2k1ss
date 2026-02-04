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
        lable: "Chat",
        href: "/conversation",
        icon: HiChatBubbleOvalLeft,
        active: pathName === "/conversation" || !!conversationId,
      },
      {
        lable: "Users",
        href: "/chat",
        icon: FaUserAlt,
        active: pathName === "/chat",
      },
      {
        lable: "Logout",
        href: "/#",
        onClick: () => signOut(),
        icon: IoLogOut,
      },
    ],

    [pathName, conversationId],
  );
  return routes;
};
