import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher/server";

import { NextResponse } from "next/server";
import { send } from "process";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const senderId = session.user.id;

  const { conversationId, text } = await req.json();

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id,
      text,
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      lastMessageAt: new Date(),
    },
  });

  // const recieverId = senderId === conversation;

  await pusherServer.trigger(
    `conversation-${conversationId}`,
    "new-message",
    message,
  );

  return NextResponse.json(message);
}
