// components/layout/MainLayout.tsx

import { FC } from "react";
import LeftSideBarWrapper from "./NavBarWrapper";
import TopBar from "@/components/admincomponents/layout/TopBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <div className="hidden lg:block">
        <LeftSideBarWrapper />
      </div>
      <div className="flex-1">
        <TopBar />
        <div className="px-8 py-10">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
