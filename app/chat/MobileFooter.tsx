"use client";

import { useRoutes } from "../hooks/useRouter";
import MobileItem from "./MobileItem";

const MobileFooter = () => {
  const routes = useRoutes();

  return (
    <nav
      className="
        fixed
        bottom-0
        inset-x-0
        z-50
        flex
        items-center
        justify-around
        border-t
        bg-white
        py-2
        lg:hidden
      "
    >
      {routes.map((item) => (
        <MobileItem
          key={item.lable}
          href={item.href}
          label={item.lable}
          icon={item.icon}
          active={item.active}
          onClick={item.onClick}
        />
      ))}
    </nav>
  );
};

export default MobileFooter;
