"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import React from "react";

type Props = {
  href: string;
  icon: React.ElementType;
  active?: boolean;
  onClick?: () => void;
};

const MobileItem = ({ href, icon: Icon, onClick }: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        `
       group
       flex
       gap-x-3
       text-sm
       leading-6
       font-semibold
       w-full
       justify-center
       p-4
       text-gray-500
       hover:text-black
       hover:bg-gray-100
        `,
        active ? "bg-gray-100" : "text-black",
      )}
    >
      <Icon
        className={clsx("h-6 w-6", active ? "text-gray-400" : "text-gray-400")}
      />

      {/* Active indicator dot */}
      {active && <span className="mt-1 h-1 w-1 rounded-full" />}
    </Link>
  );
};

export default MobileItem;
