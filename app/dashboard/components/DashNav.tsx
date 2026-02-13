import Userbtn from "@/app/components/login/userbtn";
import NotificationBell from "@/app/components/notification/NotificaitonBell";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, Search, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const DashNav = () => {
  return (
    <div
      className="
        sticky top-0 z-50
        flex justify-between items-center
        px-4 py-4
        md:px-6 md:py-5
        lg:px-9 lg:py-6
        bg-white dark:bg-[#09090b]
         
      "
    >
      <Link href="/dashboard" className="flex items-center gap-2">
        <Image src="/logo.svg" width={40} height={40} alt="logo" />
        <h2 className="text-xl font-semibold dark:text-white text-black">
          2k1s
        </h2>
      </Link>

      <div className="flex gap-3 items-center">
        {/* Button 1 — Find Store Partner */}
        {/* <Link href="/dashboard/findstore">
          <Button
            variant="outline"
            className="rounded-md lg:rounded-full cursor-pointer dark:text-white text-black flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span className="hidden lg:inline">Find Store Partner</span>
          </Button>
        </Link> */}

        {/* Button 2 — Share Your Store */}
        <Link href="/dashboard/addstore">
          <Button className="rounded-md lg:rounded-full cursor-pointer font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span className="hidden lg:inline">List Your Store</span>
          </Button>
        </Link>
        <Link href={"/chat/conversation"}>
          <Button className="rounded-full px-5 py-5" variant={"secondary"}>
            <MessageCircle className="w-5 h-5" />
            <span className="hidden md:flex">Message</span>
          </Button>
        </Link>
        {/* <NotificationBell /> */}

        <Userbtn />
      </div>
    </div>
  );
};

export default DashNav;
