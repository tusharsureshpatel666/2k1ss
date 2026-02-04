import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { conversationId: string } },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await prisma.messages.findMany({
    where: {
      conversationId: params.conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      sender: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  return NextResponse.json(messages);
}
