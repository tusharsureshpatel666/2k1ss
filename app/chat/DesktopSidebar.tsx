"use client";
import React, { useState } from "react";
import { useRoutes } from "../hooks/useRouter";
import DesktopItem from "./DesktopItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

const DesktopSidebar = () => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r lg:pb-4 lg:flex lg:flex-col">
      <nav className="mt-4 flex h-screen items-center flex-col justify-between">
        <ul role="list" className="flex flex-col gap-2 items-center space-y-1">
          {routes.map((item) => (
            <DesktopItem
              key={item.lable}
              href={item.href}
              label={item.lable}
              icon={item.icon}
              active={item.active}
              onClick={item.onClick}
            />
          ))}
        </ul>
        <Avatar>
          <AvatarImage src={session?.user?.image || "/avatar.avif"} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span
          className="
      absolute
      bottom-5
      right-4
      h-3
      w-3
      rounded-full
      bg-green-500
      ring-2
      ring-white
    "
        />
      </nav>
    </div>
  );
};

export default DesktopSidebar;
