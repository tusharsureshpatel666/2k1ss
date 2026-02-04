import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthication" }, { status: 400 });
  }

  const { storeId } = await req.json();

  const store = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
  });
  if (!store) {
    return NextResponse.json({ error: "No store found" }, { status: 400 });
  }

  const conversation = await prisma.conversation.upsert({
    where: {
      storeId_ownerId_userId: {
        storeId,
        ownerId: store.ownerId,
        userId: session.user.id,
      },
    },
    update: {},

    create: {
      storeId,
      ownerId: store.ownerId,
      userId: session.user.id,
    },
  });
  return NextResponse.json(conversation);
}
