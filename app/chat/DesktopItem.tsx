"use client";

import Link from "next/link";
import clsx from "clsx";
import { IconType } from "react-icons";

interface DesktopItemProps {
  label: string;
  href?: string;
  icon: IconType;
  active?: boolean;
  onClick?: () => void;
}

const DesktopItem = ({
  label,
  href,
  icon: Icon,
  active,
  onClick,
}: DesktopItemProps) => {
  const content = (
    <div
      className={clsx(
        "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200",
        active
          ? "bg-blue-600 text-white   "
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
      )}
    >
      <Icon size={20} />
    </div>
  );

  if (href) {
    return (
      <li>
        <Link href={href} aria-label={label} title={label}>
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li
      onClick={onClick}
      className="cursor-pointer"
      aria-label={label}
      title={label}
    >
      {content}
    </li>
  );
};

export default DesktopItem;
