import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    /* ----------------------------- */
    /* 1. Auth */
    /* ----------------------------- */
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerId = session.user.id;

    /* ----------------------------- */
    /* 2. JSON Body (✅ FIX) */
    /* ----------------------------- */
    const body = await req.json();

    const {
      title,
      desc,
      country,
      state,
      city,
      pin,
      fullAddress,
      businessType,
      peopleDesc,
      storeSize,
      priceInr,
      bannerImageUrl,
      images,
      share,
    } = body;

    /* ----------------------------- */
    /* 3. Validation */
    /* ----------------------------- */
    if (!title || !desc) {
      return NextResponse.json(
        { error: "Title and description required" },
        { status: 400 },
      );
    }

    if (!country || !state || !city || !pin || !fullAddress) {
      return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }

    if (!bannerImageUrl) {
      return NextResponse.json(
        { error: "Banner image missing" },
        { status: 400 },
      );
    }

    if (!Array.isArray(images) || images.length !== 4) {
      return NextResponse.json(
        { error: "Exactly 4 image URLs required" },
        { status: 400 },
      );
    }

    if (!share || !share.mode) {
      return NextResponse.json(
        { error: "Share data missing" },
        { status: 400 },
      );
    }

    /* ----------------------------- */
    /* 4. Create Store */
    /* ----------------------------- */
    const store = await prisma.store.create({
      data: {
        ownerId,
        title,
        desc,
        peopleDesc,
        storeSize,
        businessType,
        country,
        state,
        city,
        pin,
        fullAddress,
        priceInr,
        bannerImageUrl,

        shareMode: share.mode,
        startTime: share.startTime,
        endTime: share.endTime,
        days: share.days ?? [],
        sqft: share.sqft,
        dayOrNight: share.dayOrNight,

        images: {
          createMany: {
            data: images.map((url: string, index: number) => ({
              url,
              order: index,
            })),
          },
        },
      },
      include: { images: true },
    });

    /* ----------------------------- */
    /* 5. Success */
    /* ----------------------------- */
    return NextResponse.json(
      { message: "Store created successfully", store },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create store error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
