"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Birdhouse, HomeIcon } from "lucide-react";

/* ----------------------------------
   Share type (same as Prisma enum)
----------------------------------- */
type ShareType =
  | "HOURS_BY_HOURS"
  | "DAYS_BY_DAYS"
  | "DAY_OR_NIGHT"
  | "SPLIT_STORE";

/* ----------------------------------
   Props Interface
----------------------------------- */
interface ReserveCardProps {
  price: number;
  sharetype: ShareType;
  partnerBussiness?: string;

  startTime?: string;
  endTime?: string;
  days?: string[];
  dayOrNight?: "Day" | "Night";
}

/* ----------------------------------
   Component
----------------------------------- */
export default function ReserveCard(props: ReserveCardProps) {
  const {
    price,
    sharetype,
    partnerBussiness,
    startTime,
    endTime,
    days,
    dayOrNight,
  } = props;

  /* ----------------------------------
     Render share details (Dialog)
  ----------------------------------- */
  const renderDialogDetails = () => {
    switch (sharetype) {
      case "HOURS_BY_HOURS":
        return (
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Time:</span> {startTime} – {endTime}
            </p>
          </div>
        );

      case "DAYS_BY_DAYS":
        return (
          <div className="space-y-2">
            <p className="font-medium text-sm">Available Days</p>
            <div className="flex flex-wrap gap-2">
              {days?.map((day) => (
                <span
                  key={day}
                  className="rounded-full border px-3 py-1 text-xs"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        );

      case "DAY_OR_NIGHT":
        return (
          <p className="text-sm">
            <span className="font-medium">Slot:</span> {dayOrNight}
          </p>
        );

      case "SPLIT_STORE":
        return (
          <p className="text-sm">
            <span className="font-medium">Partner Business:</span>{" "}
            {partnerBussiness}
          </p>
        );

      default:
        return null;
    }
  };

  /* ----------------------------------
     JSX
  ----------------------------------- */
  return (
    <div className="">
      {/* Price */}

      {/* Share Type Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"} className="text-sm font-medium ">
            <Birdhouse /> {sharetype.replaceAll("_", " ")}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sharing Details</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">{renderDialogDetails()}</div>
        </DialogContent>
      </Dialog>

      {/* Reserve Button */}

      {/* Footer */}
    </div>
  );
}
