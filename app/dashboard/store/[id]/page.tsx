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

interface StorePageProps {
  params: {
    id: string;
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const storeId = await params;
  console.log(storeId.id);

  const userId = await auth();
  console.log(userId?.user?.id);

  if (!storeId) {
    return <div className="p-6">Store not found</div>;
  }

  const fetchStores = async () => {
    const store = await getStoreById(storeId.id);

    console.log(store);
    return store;
  };

  const store = await fetchStores();
  console.log("store", store);
  const OwerDetail = await findUserById(store?.ownerId);
  console.log(OwerDetail);
  const isOwner = (await userId?.user?.id) === (await store?.ownerId);
  console.log(storeId.id, store?.ownerId);

  const allImages = [
    store?.bannerImageUrl,
    ...(store?.images?.map((img) => img.url) || []),
  ].filter(Boolean);

  return (
    <div className="max-w-7xl w-full space-y-6 mb-[50px] md:mt-2  sm:px-6 lg:px-0">
      {/* ================= HEADER ================= */}
      <div className="flex  gap-4 sm:flex-row sm:items-center justify-between">
        <h1 className="text-2xl font-semibold break-words">{store?.title}</h1>

        <div className="flex gap-4 items-center text-sm">
          <ShareStore paramsId={storeId} />
          <LoveStore storeId={storeId.id} initialLiked={userId?.user?.id} />
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
              flex justify-center items-center
    fixed bottom-0 left-0 right-0 
    border-t bg-background px-2 py-3
     gap-2
    sm:static sm:border-0 sm:p-0
  "
            >
              {/* Chat */}
              <Link
                href={{
                  pathname: `/dashboard/message/${store?.id}`,
                }}
              >
                <Button className="flex-1 rounded-md">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat Partner
                </Button>
              </Link>

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

          <PeopleDesc peopleDesc={store?.desc} />
        </div>
      </div>
    </div>
  );
}
