import { uploadToCloudinary } from "@/lib/cloudinary";
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
    /* 2. Form Data */
    /* ----------------------------- */
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const country = formData.get("country") as string;
    const state = formData.get("state") as string;
    const city = formData.get("city") as string;
    const pin = formData.get("pin") as string;
    const fullAddress = formData.get("fullAddress") as string;
    const businessType = formData.get("businessType") as string;
    const peopleDesc = formData.get("peopleDesc") as string;
    const storeSize = formData.get("storeSize") as string;
    const priceInr = Number(formData.get("priceInr"));
    const bannerImageUrl = formData.get("bannerImage") as string;
    const shareRaw = formData.get("share") as string;

    /* ----------------------------- */
    /* 3. Validation (FAIL FAST) */
    /* ----------------------------- */
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!desc) {
      return NextResponse.json(
        { error: "Description required" },
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

    if (Number.isNaN(priceInr)) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    if (!shareRaw) {
      return NextResponse.json(
        { error: "Share data missing" },
        { status: 400 },
      );
    }

    let share;
    try {
      share = JSON.parse(shareRaw);
    } catch {
      return NextResponse.json(
        { error: "Invalid share data" },
        { status: 400 },
      );
    }

    /* ----------------------------- */
    /* 4. Collect 4 Images (FILES) */
    /* ----------------------------- */
    const imageFiles: File[] = [];

    for (let i = 0; i < 4; i++) {
      const img = formData.get(`image_${i}`);
      if (img instanceof File && img.size > 0) {
        imageFiles.push(img);
      }
    }

    if (imageFiles.length !== 4) {
      return NextResponse.json(
        { error: "Exactly 4 images required" },
        { status: 400 },
      );
    }

    /* ----------------------------- */
    /* 5. Upload Images (PARALLEL ⚡) */
    /* ----------------------------- */
    const imageUploads = await Promise.all(
      imageFiles.map((file) => uploadToCloudinary(file, "image")),
    );

    /* ----------------------------- */
    /* 6. Google Geocoding (SOFT FAIL) */
    /* ----------------------------- */
    let latitude: number | null = null;
    let longitude: number | null = null;

    try {
      const address = `${fullAddress}, ${city}, ${state}, ${country}, ${pin}`;
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address,
        )}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
      );

      const data = await res.json();
      if (data.status === "OK") {
        latitude = data.results[0].geometry.location.lat;
        longitude = data.results[0].geometry.location.lng;
      }
    } catch {
      console.warn("Geocoding failed");
    }

    /* ----------------------------- */
    /* 7. Create Store */
    /* ----------------------------- */
    const store = await prisma.store.create({
      data: {
        ownerId,
        title,
        desc,
        country,
        state,
        city,
        pin,
        fullAddress,
        priceInr,
        businessType,
        peopleDesc,
        storeSize,
        bannerImageUrl, // ✅ already a URL
        latitude,
        longitude,
        shareMode: share.mode,
        startTime: share.startTime,
        endTime: share.endTime,
        days: share.days ?? [],
        sqft: share.sqft,
        dayOrNight: share.dayOrNight,
        images: {
          create: imageUploads.map((img, index) => ({
            url: img.secure_url,
            order: index,
          })),
        },
      },
      include: { images: true },
    });

    /* ----------------------------- */
    /* 8. Success */
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
