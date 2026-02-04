import React from "react";
import EmptyState from "../components/message/EmptyState";

const Page = () => {
  return (
    <div className="hidden lg:block  h-screen lg:pl-80">
      <EmptyState />
    </div>
  );
};

export default Page;
