import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { FC } from "react";

interface NavBarProps {
  pathname: string;
}

const LeftSideBar: FC<NavBarProps> = ({ pathname }) => {
  const { data: session, status } = useSession();

  const user = session?.user as {
    name?: string;
    avatar?: string;
  };
  const { name, avatar } = user || {};
  const defaultAvatar =
    "https://res.cloudinary.com/dsonuae0l/image/upload/v1730193086/avartar_byu4f1.png";

  return (
    <div className="h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-blue-2 shadow-xl max-lg:hidden">
      <Image src="/logo.png" alt="logo" width={150} height={70} />

      <div className="flex flex-col gap-12">
        {navLinks.map((link) =>
          link.label === "Profile" ? (
            <Link
              href={link.url}
              key={link.label}
              className="flex gap-4 items-center group"
            >
              <Image
                src={avatar || defaultAvatar}
                alt={`${name || "User"}'s avatar`}
                width={30}
                height={30}
                className="rounded-full"
              />
              <span className="opacity-0 text-blue-1">{name || ""}</span>
            </Link>
          ) : (
            <Link
              href={link.url}
              key={link.label}
              className={`flex gap-4 text-body-medium ${
                pathname === link.url ? "text-blue-1" : "text-grey-1"
              }`}
            >
              {link.icon} <p>{link.label}</p>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
