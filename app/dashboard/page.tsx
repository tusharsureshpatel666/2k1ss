"use client";

import FormSetup from "./components/formsetup/FormSetup";
import SearchBox from "./components/Main";
import ListedStore from "./findstore/ListedStore";

export default function Dashboard() {
  return (
    <div className="w-full max-w-6xl">
      <SearchBox />
      <div className="h-screen">
        <ListedStore />
      </div>
    </div>
  );
}
