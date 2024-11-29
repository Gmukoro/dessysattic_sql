"use client";

import { FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { CircleUserRound } from "lucide-react";

const Footer = () => {
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
    <footer className="bg-black text-white py-8 px-4 sm:px-6 md:px-8 lg:px-16 overflow-x-hidden">
      <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-start space-y-6 lg:space-y-0">
        <div className="w-full lg:w-1/3 mb-4 lg:mb-0">
          <Link
            href="/"
            className={`hover:text-red-1 ${pathname === "/" && "text-red-1"}`}
          >
            <Image
              src="/logo.png"
              alt="Website Logo"
              width={150}
              height={50}
              className="w-auto h-auto"
            />
          </Link>
        </div>

        <div className="w-full lg:w-2/3 flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
          <div className="w-full lg:w-2/3 text-neutral-400 grid grid-cols-2 gap-4">
            {/* Column 1 */}
            <div className="flex flex-col space-y-2">
              <Link
                href="/company"
                className={`hover:text-red-1 ${
                  pathname === "/company" && "text-red-1"
                }`}
              >
                Company
              </Link>

              <Link
                href="/product_information"
                className={`hover:text-red-1 ${
                  pathname === "/product_information" && "text-red-1"
                }`}
              >
                Product Information
              </Link>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col space-y-2">
              <Link
                href="/return_exchange"
                className={`hover:text-red-1 ${
                  pathname === "/return_exchange" && "text-red-1"
                }`}
              >
                Return and Exchange
              </Link>
              <Link
                href="/contact_us"
                className={`hover:text-red-1 ${
                  pathname === "/contact_us" && "text-red-1"
                }`}
              >
                Contact Us
              </Link>
              <Link
                href="/delivery"
                className={`hover:text-red-1 ${
                  pathname === "/delivery" && "text-red-1"
                }`}
              >
                Delivery
              </Link>
              <Link
                href="/return_policy"
                className={`hover:text-red-1 ${
                  pathname === "/return_policy" && "text-red-1"
                }`}
              >
                Return Policy
              </Link>
              <Link
                href="/privacy_policy"
                className={`hover:text-red-1 ${
                  pathname === "/privacy_policy" && "text-red-1"
                }`}
              >
                Privacy Policy
              </Link>

              {/* My Account / User Section */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/profile"
                    className="flex gap-4 items-center group relative"
                  >
                    <Image
                      src={avatar || defaultAvatar}
                      alt={`${name || "User"}'s avatar`}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <div className="absolute bottom-0 left-0 w-full flex justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-1">
                        {name || "User"}
                      </span>
                    </div>
                  </Link>
                  <span className="text-neutral-400">My Account</span>
                </div>
              ) : (
                <Link href="/sign-in" className="flex items-center space-x-2">
                  <CircleUserRound />
                  <span>Account</span>
                </Link>
              )}

              <Link
                href="/return_portal"
                className={`hover:text-red-1 ${
                  pathname === "/return_portal" && "text-red-1"
                }`}
              >
                Return Portal
              </Link>
              <Link
                href="/terms_of_service"
                className={`hover:text-red-1 ${
                  pathname === "/terms_of_service" && "text-red-1"
                }`}
              >
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="w-full lg:w-1/3 flex justify-center lg:justify-end mt-6 lg:mt-0">
            <div className="flex space-x-6 lg:space-x-6 justify-center lg:justify-end">
              <a
                href="https://www.instagram.com/dessysattic"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="bg-amber-800 p-3 rounded-full flex justify-center items-center">
                  <FaInstagram className="text-3xl text-white" />
                </div>
                <span className="sr-only">Instagram</span>
                <div className="text-center text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Instagram
                </div>
              </a>
              <a
                href="https://www.tiktok.com/@official_d.s.y"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="bg-amber-800 p-3 rounded-full flex justify-center items-center">
                  <FaTiktok className="text-3xl text-white" />
                </div>
                <span className="sr-only">TikTok</span>
                <div className="text-center text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  TikTok
                </div>
              </a>
              <a
                // href="https://twitter.com"
                // target="_blank"
                // rel="noopener noreferrer"
                className="group"
              >
                <div className="bg-amber-800 p-3 rounded-full flex justify-center items-center">
                  <FaTwitter className="text-3xl text-white" />
                </div>
                <span className="sr-only">X</span>
                <div className="text-center text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  X
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className=" mt-8 text-center text-sm bg-amber-900 text-neutral-300 bg-gradient-to-r from-yellow-700 via-yellow-900 to-amber-700  px-6 py-2 rounded-lg text-base sm:text-lg">
        © {new Date().getFullYear()} D S Y. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
