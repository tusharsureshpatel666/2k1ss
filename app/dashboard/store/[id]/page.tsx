import Image from "next/image";
import {
  ChartArea,
  Circle,
  Heart,
  Megaphone,
  MessageCircle,
  Share,
  Share2,
  Star,
  Trash,
} from "lucide-react";

import { getStoreById } from "@/lib/query/getstore";
import { auth } from "@/lib/auth";
import DeleteStoreButton from "./components/DeleteStore";
import ShareStore from "./components/ShareStore";
import { findUserById } from "@/lib/findUser";
import LoveStore from "./components/LoveStore";
import { MobileImageSlider } from "./components/MobileNav";
import { DesktopImageGrid } from "./components/Desktopgrid";
import VideoPlay from "./components/videoplay";
import OwnerButton from "./components/OwerButton";
import Heading from "../../components/heading";
import ReserveCard from "./components/priceCard";
import PeopleDesc from "./components/peopleDesc";
import { Button } from "@/components/ui/button";
import ReportDialog from "../../components/report";
import Link from "next/link";
import StoreLocationMap from "./components/ShowMap";
import axios from "axios";
import ChatPartnerButton from "../../components/ChatPartner";
import StoreDesc from "../../components/StoreDesc";
import prisma from "@/lib/prisma";

interface StorePageProps {
  params: {
    id: string;
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const storeId = await params;

  const userId = await auth();
  let initialLiked = false;

  if (userId) {
    const like = await prisma.storeLike.findUnique({
      where: {
        userId_storeId: {
          userId: userId.user?.id as string,
          storeId: storeId.id,
        },
      },
    });

    initialLiked = !!like;
  }

  if (!storeId) {
    return <div className="p-6">Store not found</div>;
  }

  const fetchStores = async () => {
    const store = await getStoreById(storeId.id);

    console.log(store);
    return store;
  };

  const store = await fetchStores();
  const OwerDetail = await findUserById(store?.ownerId);
  const isOwner = (await userId?.user?.id) === (await store?.ownerId);

  const allImages = [
    store?.bannerImageUrl,
    ...(store?.images?.map((img) => img.url) || []),
  ].filter(Boolean);

  return (
    <div className="max-w-7xl w-full space-y-6  md:mt-2   lg:px-0">
      {/* ================= HEADER ================= */}
      <div className="flex  gap-4 flex-col md:flex-row sm:items-center items-center justify-between">
        <h1 className="text-xl  font-semibold break-words leading-tight">
          {store?.title}
        </h1>

        <div className="flex gap-4 items-center text-sm">
          <ShareStore paramsId={storeId} />
          <LoveStore storeId={storeId.id} initialLiked={initialLiked} />
          {isOwner && <DeleteStoreButton storeId={store?.id} />}
        </div>
      </div>

      {/* ================= IMAGES ================= */}
      <MobileImageSlider images={allImages} />

      <div className="hidden md:block">
        <DesktopImageGrid
          banner={store?.bannerImageUrl || ""}
          images={store?.images.map((img) => img.url) || []}
        />
      </div>

      {/* ================= LOCATION ================= */}
      <Heading title={`Rental Store on ${store?.city}`} className="mb-3" />
      <div className="flex gap-2 items-center">
        <h1 className="text-2xl">{`₹ ${store?.priceInr}`}</h1>
        <span className="text-gray-500 text-sm">/ month</span>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="grid grid-cols-1  gap-6 ">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex  md:flex-row justify-between md:items-center">
            <OwnerButton
              image={OwerDetail.image || "/avatar.avif"}
              name={OwerDetail.name || ""}
              createAt={String(store?.createdAt)}
            />
            {/* Spacer for mobile footer height */}

            {/* Bottom Footer */}
            <div
              className="
              z-10
              flex justify-center items-center
    fixed bottom-12 left-0 right-0 
    border-t bg-background px-2 py-3
     gap-2
    sm:static sm:border-0 sm:p-0
  "
            >
              {/* Chat */}
              {userId?.user?.id && !isOwner && (
                <ChatPartnerButton storeId={storeId.id} />
              )}

              {/* Share / Reserve */}
              <ReserveCard
                price={store?.priceInr}
                sharetype={store?.shareMode}
                partnerBussiness={store?.businessType}
                days={store?.days}
                startTime={store?.startTime ?? ""}
                endTime={store?.endTime ?? ""}
                dayOrNight={store?.dayOrNight}
              />

              {/* Report */}
              <ReportDialog />
            </div>
          </div>
          <StoreDesc description={store?.desc || ""} />
          {/* <PeopleDesc peopleDesc={store?.desc} /> */}

          <StoreLocationMap
            lat={store.latitude}
            lng={store.longitude}
            storeName="New Delhi Store"
          />
        </div>
      </div>
    </div>
  );
}
