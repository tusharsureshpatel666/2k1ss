"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Send, SendIcon } from "lucide-react";
import { useState } from "react";

export default function ChatInput({
  conversationId,
}: {
  conversationId: string;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const handelSend = async () => {
    setLoading(true);
    const res = await axios.post("/api/message/send", { conversationId, text });
    console.log(res);
    setLoading(false);
    setText("");
  };
  return (
    <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-4 py-5">
      <input
        placeholder="Type a message"
        onChange={(e) => setText(e.target.value)}
        value={text}
        className="flex-1 rounded-lg  px-4 py-2 text-sm outline-none"
      />

      <Button
        size={"lg"}
        disabled={loading}
        className="rounded-md"
        onClick={handelSend}
      >
        <SendIcon className="w-5 h-5" />
      </Button>
    </div>
  );
}
