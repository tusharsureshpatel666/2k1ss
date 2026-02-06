"use client";

import { useRef, useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

const libraries: "places"[] = ["places"];

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const boundsRef = useRef<google.maps.LatLngBounds | null>(null);

  // ✅ Called only AFTER google script loads
  const handleLoad = () => {
    autocompleteService.current = new google.maps.places.AutocompleteService();

    placesService.current = new google.maps.places.PlacesService(
      document.createElement("div"),
    );

    boundsRef.current = new google.maps.LatLngBounds(
      { lat: 28.4, lng: 76.84 },
      { lat: 28.88, lng: 77.35 },
    );
  };

  const handleChange = (value: string) => {
    setQuery(value);

    if (!value || !autocompleteService.current) {
      setResults([]);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      {
        input: value,
        componentRestrictions: { country: "in" },
        bounds: boundsRef.current!,
        strictBounds: true,
      },
      (predictions) => {
        setResults(predictions || []);
        setOpen(true);
      },
    );
  };

  const handleSelect = (placeId: string, description: string) => {
    setQuery(description);
    setOpen(false);

    placesService.current?.getDetails({ placeId }, (place) => {
      if (!place?.geometry?.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      router.push(
        `/dashboard/search?lat=${lat}&lng=${lng}&place=${encodeURIComponent(description)}`,
      );
    });
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={libraries}
      onLoad={handleLoad} // ✅ IMPORTANT
    >
      <div className="relative  w-full max-w-6xl">
        {/* Search Bar */}
        <div className="flex items-center rounded-full border border-gray-300 bg-white dark:border-gray-600 dark:bg-black/50 shadow-lg">
          <div className="flex flex-1 items-center gap-3 px-6 py-5">
            <Search className="h-5 w-5 text-gray-500" />
            <input
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Search area in New Delhi"
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
              onFocus={() => setOpen(true)}
            />
          </div>
        </div>

        {/* Custom Dropdown */}
        {open && results.length > 0 && (
          <div className="absolute z-50 mt-2 w-full rounded-xl border bg-white shadow-xl dark:border-gray-700 dark:bg-black">
            {results.map((item) => (
              <button
                key={item.place_id}
                onClick={() => handleSelect(item.place_id, item.description)}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <MapPin className="h-4 w-4 text-gray-500" />
                {item.description}
              </button>
            ))}
          </div>
        )}
      </div>
    </LoadScript>
  );
}
