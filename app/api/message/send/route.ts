import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId, text } = await req.json();

  if (!conversationId || !text) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Security check
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ ownerId: session.user.id }, { userId: session.user.id }],
    },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id,
      text,
    },
  });

  return NextResponse.json(message);
}
