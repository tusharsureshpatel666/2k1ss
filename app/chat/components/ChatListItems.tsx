import Image from "next/image";

export default function ChatListItem() {
  return (
    <div className="flex cursor-pointer gap-3 px-3 py-3 hover:bg-[#202c33]">
      <Image
        src="/avatar.png"
        alt="user"
        width={48}
        height={48}
        className="rounded-full"
      />

      <div className="flex-1 border-b border-[#2a3942] pb-3">
        <div className="flex justify-between">
          <p className="font-medium">Neha Patel</p>
          <span className="text-xs text-gray-400">8:06 pm</span>
        </div>
        <p className="truncate text-sm text-gray-400">
          JAYA PATEL (1).pdf
        </p>
      </div>
    </div>
  );
}
