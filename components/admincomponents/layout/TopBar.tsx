// components/layout/TopBar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { navLinks } from "@/lib/constants";

const TopBar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user as {
    name?: string;
    avatar?: string;
  };
  const { name, avatar } = user || {};
  const defaultAvatar =
    "https://res.cloudinary.com/dsonuae0l/image/upload/v1730193086/avartar_byu4f1.png";

  return (
    <div className="sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 bg-gray-400 shadow-xl lg:hidden">
      <Image src="/logo.png" alt="logo" width={150} height={70} />

      <div className="flex gap-8 max-md:hidden">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-4 text-body-medium ${
              pathname === link.url ? "text-amber-800" : "text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="relative flex gap-4 items-center">
        <Menu
          className="cursor-pointer md:hidden"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        />
        {dropdownMenu && (
          <div className="absolute top-10 right-6 flex flex-col gap-8 p-5 bg-gray-400 shadow-xl rounded-lg">
            {navLinks.map((link) => (
              <Link
                href={link.url}
                key={link.label}
                className="flex gap-4 text-body-medium text-amber-800"
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>
        )}
        <Link href="/profile" className="flex gap-4 items-center group">
          <Image
            src={avatar || defaultAvatar}
            alt={`${name || "User"}'s avatar`}
            width={30}
            height={30}
            className="rounded-full"
          />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-amber-800">
            {name || "Profile"}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
