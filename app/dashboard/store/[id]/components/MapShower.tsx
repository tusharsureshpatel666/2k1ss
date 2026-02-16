"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Maximize2, X } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = L.divIcon({
  className: "",
  html: `
    <div class="relative flex items-center justify-center">
      
      <!-- Outer soft shadow ring -->
      <div class="absolute w-14 h-14 bg-black/10 rounded-full blur-md"></div>
      
      <!-- Main circle -->
      <div 
        class="
          w-12 h-12 
          bg-[#1f1f1f] 
          rounded-full 
          flex items-center justify-center 
          shadow-xl 
          border border-white/10
          transition-all duration-200
          hover:scale-110
        "
      >
        <!-- Home Icon (SVG) -->
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="white" 
          class="w-5 h-5"
        >
          <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

interface LocationMapProps {
  lat: number;
  lng: number;
}

export default function LocationMap({ lat, lng }: LocationMapProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isFullScreen ? "hidden" : "auto";
  }, [isFullScreen]);

  const MapView = ({ height }: { height: string }) => (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={true}
      zoomControl={false}
      className={`${height} w-full rounded-3xl`}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[lat, lng]} icon={customIcon} />
    </MapContainer>
  );

  return (
    <>
      {/* Normal View */}
      <div
        className="relative rounded-3xl overflow-hidden mb-8 border 
                      border-gray-200 dark:border-gray-700
                      bg-white dark:bg-gray-900 
                      shadow-sm hover:shadow-xl transition duration-300"
      >
        <div className="flex items-center justify-between px-6 pt-6">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Store Location
          </h1>

          <button
            onClick={() => setIsFullScreen(true)}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl
                       bg-gray-100 dark:bg-gray-800
                       hover:bg-gray-200 dark:hover:bg-gray-700
                       text-gray-700 dark:text-gray-200
                       transition"
          >
            <Maximize2 size={16} />
            View Full Map
          </button>
        </div>

        <div className="mt-4 px-4 pb-6">
          <MapView height="h-[350px]" />
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          {/* Centered Card */}
          <div
            className="relative w-full max-w-5xl bg-white dark:bg-gray-900 
                          rounded-3xl shadow-2xl border 
                          border-gray-200 dark:border-gray-700"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFullScreen(false)}
              className="absolute top-5 right-5 z-[1000] 
                         bg-white dark:bg-gray-800
                         text-gray-800 dark:text-gray-100
                         p-3 rounded-full shadow-lg 
                         hover:scale-105 transition"
            >
              <X size={20} />
            </button>

            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Store Location
              </h2>

              {/* SAME 350px style but larger */}
              <MapView height="h-[500px]" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
