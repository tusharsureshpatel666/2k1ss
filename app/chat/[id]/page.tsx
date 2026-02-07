import React from "react";
import EmptyState from "../components/EmptyState";
import Windows from "../components/window";
import ChatListItem from "../components/ChatListItems";

const page = async ({ params }) => {
  const conversation = await params;
  console.log(conversation.id);
  return (
    <div className="hidden lg:block w-full h-screen">
      {!conversation.id ? <EmptyState /> : <Windows id={conversation.id} />}
    </div>
  );
};

export default page;
