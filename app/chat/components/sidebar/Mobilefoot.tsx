"use client";
import { useConversation } from "@/app/hooks/useConversation";
import { useRoutes } from "@/app/hooks/useRouter";
import React from "react";
import MobileItem from "./MobileItem";

const Mobilefooter = () => {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  return (
    <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white dark:bg-gray-900 lg:hidden  border-t-[1px]">
      {routes.map((route) => (
        <MobileItem
          key={route.href}
          href={route.href}
          active={route.active}
          icon={route.icon}
          onClick={route.onClick}
        />
      ))}
    </div>
  );
};

export default Mobilefooter;
