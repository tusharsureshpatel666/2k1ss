"use client";
import { Button } from "@/components/ui/button";
import { ChartBar, Cross } from "lucide-react";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaChartLine } from "react-icons/fa";
import { useParams } from "next/navigation";
import { getStoreById } from "@/lib/query/getstore";

const Storeanyltic = () => {
  const [open, setOpen] = useState(false);
 


  return (
    <div>
      {/* Button */}
      <Button
        onClick={() => setOpen(true)}
        variant={"secondary"}
        className="px-4 py-2 rounded-full text-white "
      >
        <FaChartLine /> Analytics
      </Button>

      {/* Full Screen Modal */}
      {open && (
        <div className="fixed inset-0 k w-full h-screen z-50 flex items-center justify-center">
          <div className="dark:bg-black bg-white text-black dark:text-white text-blac w-full h-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute  top-5 right-5 cursor-pointer text-black dark:text-white text-xl"
            >
              <IoClose width={20} height={20} />
            </button>

            {/* Content */}
            <h1 className="text-2xl font-bold mb-6">Store Analytics</h1>

            <div className="grid grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">Location Data</div>
              <div className="p-4 border rounded-lg">Target Audience</div>
              <div className="p-4 border rounded-lg">Revenue Estimate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Storeanyltic;
