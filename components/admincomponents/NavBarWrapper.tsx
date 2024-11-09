// components/layout/LeftSideBarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import LeftSideBar from "@/components/admincomponents/layout/LeftSideBar";

const NavBarWrapper = () => {
  const pathname = usePathname();

  return <LeftSideBar pathname={pathname} />;
};

export default NavBarWrapper;
