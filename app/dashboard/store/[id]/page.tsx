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

import PeopleDesc from "./components/peopleDesc";
import { Button } from "@/components/ui/button";
import ReportDialog from "../../components/report";
import Link from "next/link";
import StoreLocationMap from "./components/ShowMap";
import axios from "axios";
import ChatPartnerButton from "../../components/ChatPartner";
import StoreDesc from "../../components/StoreDesc";
import prisma from "@/lib/prisma";
import SharingType from "./components/SharingType";
import OwnerDesc from "./components/OwnerDesc";
import People from "./components/people";
import LocationMap from "./components/MapShower";
import Editbutton from "./components/Editbutton";

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
    <div className="max-w-7xl w-full space-y-6  md:mt-2 mb-[150px] lg:mb-0   lg:px-0">
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

      {/* ================= HEADER ================= */}
      <Heading
        title={`${store?.storeSize?.replace(/store/i, "size")} in ${store?.city}`}
        className="mb-2"
      />

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 mt-5 lg:grid-cols-3 gap-8">
        {/* ================= LEFT CONTENT ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* Owner Section */}
          <div className="flex justify-between items-center border-b pb-6">
            <OwnerButton
              image={OwerDetail.image || "/avatar.avif"}
              name={OwerDetail.name || ""}
              createAt={String(store?.createdAt)}
            />
            <ReportDialog />
          </div>

          <div className="gap-4 flex flex-col ">
            <h1 className="text-xl">Store Sharing Method</h1>
            <SharingType
              sharetype={store?.shareMode}
              days={store?.days}
              startTime={store?.startTime ?? ""}
              endTime={store?.endTime ?? ""}
              dayOrNight={store?.dayOrNight}
            />
            <OwnerDesc
              businessName={store?.businessType}
              ownerName={OwerDetail.name}
              description={store?.desc}
            />
            <People description={store?.peopleDesc} />
          </div>

          {/* Map */}
          {/* <StoreLocationMap
            lat={store?.latitude}
            lng={store?.longitude}
            storeName={`${store?.storeSize} in ${store?.city}`}
          /> */}
        </div>

        {/* ================= RIGHT SIDE (Desktop Reserve Card) ================= */}
        <div className="hidden lg:block">
          <div
            className="sticky top-24 border border-gray-200 dark:border-gray-700 
                  bg-white dark:bg-gray-900
                  rounded-2xl shadow-sm p-6 space-y-5 "
          >
            <h1 className="text-2xl">Store Price</h1>
            {/* Discount + Price */}
            <div className="space-y-1">
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
                  ₹{store?.priceInr}
                </span>
                <span className="text-sm text-gray-500 mb-1">/month</span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                Inclusive of all taxes
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700"></div>

            {/* Offers Section */}
            {/* <div className="space-y-3">
              <h3 className="text-sm font-semibold text-orange-600">
                Save Extra with 3 offers
              </h3>

              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium text-black dark:text-white">
                  Cashback:
                </span>{" "}
                Get 5% back with select bank cards.
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium text-black dark:text-white">
                  Bank Offer:
                </span>{" "}
                7.5% Instant Discount on EMI transactions.
              </div>
            </div> */}

            {/* CTA Button */}
            {isOwner ? (
              <Editbutton />
            ) : (
              <ChatPartnerButton storeId={store?.id} />
            )}
          </div>
        </div>
      </div>
      <LocationMap lat={store?.latitude} lng={store?.longitude} />

      {/* ================= MOBILE STICKY FOOTER ================= */}
      <div
        className="
  lg:hidden
  fixed bottom-9 left-0 right-0
  border-t bg-background
  px-4 py-3
  z-6000
  flex items-center justify-between
"
      >
        <div
          className="w-full bg-white border-t border-gray-200 
                    py-3 px-1 flex items-center justify-between"
        >
          {/* Left Section */}
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
              ₹{store?.priceInr}
            </span>
            <span className="text-sm text-gray-500 mb-1">/month</span>
          </div>
          {isOwner ? <Editbutton /> : <ChatPartnerButton storeId={store?.id} />}

          {/* Right Button */}
        </div>
      </div>
    </div>
  );
}
