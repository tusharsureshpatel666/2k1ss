"use client";

import React from "react";
import ChatListItem from "./ChatListItems";

const ChatSidebar = () => {
  return (
    <div className="flex h-full flex-col min-h-0">
      {/* Search */}
      <div className="p-3 shrink-0">
        <input
          placeholder="Search or start a new chat"
          className="w-full rounded-lg bg-[#202c33] px-4 py-2 text-sm outline-none"
        />
      </div>

      {/* Chat list */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {[...Array(20)].map((_, i) => (
          <ChatListItem key={i} />
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
