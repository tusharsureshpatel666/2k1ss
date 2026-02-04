import Image from "next/image";
import React from "react";

const EmptyState = () => {
  return (
    <div className="px-4 py-10 w-full sm:px-6 lg:px-8 h-full flex justify-center items-center bg-gray-100 dark:bg-gray-800">
      <div className="flex justify-center items-center flex-col gap-4">
        <Image src="/logo.svg" width={100} height={150} alt="hello" />
        <h1 className="text-xl text-center items-center flex flex-col">
          Select a Chat a new conversation
        </h1>
      </div>
    </div>
  );
};

export default EmptyState;
