import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId } = await req.json();

  // mark all messages as seen (except mine)
  const updated = await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: session.user.id },
      seen: false,
    },
    data: { seen: true },
  });

  // notify sender in realtime
  await pusherServer.trigger(
    `conversation-${conversationId}`,
    "messages-seen",
    { conversationId },
  );

  return NextResponse.json({ success: true });
}
