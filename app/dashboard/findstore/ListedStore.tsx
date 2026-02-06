"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { StoreCardSkeleton } from "../store/[id]/components/storeSkeleton";

const STORES_CARD_QUERY = gql`
  query StoresCard {
    stores {
      id
      title
      bannerImageUrl
      priceInr
    }
  }
`;

const ListedStore = () => {
  const { data, loading, error } = useQuery(STORES_CARD_QUERY);
  // const { data: session } = useSession();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-0 lg:px-4 py-8">
        <div className="grid grid-cols-2 gap-2 md:gap-4 lg:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <StoreCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p>Error loading stores</p>;

  return (
    <div className="mx-auto max-w-7xl lg:px-4 px-0 py-8">
      <div className="grid grid-cols-2 gap-2 md:gap-4 lg:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.stores.map((item: any) => (
          <Link
            href={`/dashboard/store/${item.id}`}
            key={item.id}
            className="group cursor-pointer overflow-hidden mb-4"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                width={400}
                height={400}
                src={item.bannerImageUrl || "/placeholder.jpg"}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="mt-3 space-y-1">
              <h3 className="md:text-sm text-xs font-semibold text-gray-800 dark:text-white">
                {item.title}
              </h3>

              <p className="md:text-sm text-xs font-medium text-gray-900 dark:text-white">
                ₹{item.priceInr}
                <span className="text-gray-500"> / month</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ListedStore;
