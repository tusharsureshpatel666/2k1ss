"use client";

import Link from "next/link";
import clsx from "clsx";
import { IconType } from "react-icons";

interface MobileItemProps {
  label: string;
  href?: string;
  icon: IconType;
  active?: boolean;
  onClick?: () => void;
}

const MobileItem = ({
  label,
  href,
  icon: Icon,

  active,
  onClick,
}: MobileItemProps) => {
  const className = clsx(
    "flex flex-col items-center justify-center gap-1 text-xs transition",
    active ? "text-blue-600" : "text-gray-400 hover:text-gray-600",
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-label={label}>
        <Icon size={22} />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className} aria-label={label}>
      <Icon size={22} />
      <span>{label}</span>
    </button>
  );
};

export default MobileItem;
