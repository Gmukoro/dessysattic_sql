"use client";

import React, { useState, FC } from "react";
import useCart from "@/lib/hooks/useCart";
import { useSession } from "next-auth/react";
import { CircleUserRound, Menu, Search, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CurrencySelector from "./CurrencyDropdownContext";
import { Session } from "next-auth";

interface DesktopNavLinksProps {
  pathname: string;
  user: Session["user"] | null | undefined;
}

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  toggleShopDropdown: () => void;
  isShopDropdownVisible: boolean;
  user: Session["user"] | null | undefined;
}

const Logo: FC = React.memo(() => (
  <Link href="/" className="mx-auto">
    <Image
      src="/logo.png"
      alt="logo"
      width={100}
      height={100}
      className="max-sm:w-16 max-sm:h-auto"
    />
  </Link>
));

const DesktopNavLinks: FC<DesktopNavLinksProps> = React.memo(
  ({ pathname, user }) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    return (
      <div className="hidden lg:flex justify-center gap-8 text-base-bold mt-4">
        <Link
          href="/"
          className={`hover:text-red-1 ${pathname === "/" && "text-red-1"}`}
        >
          HOME
        </Link>
        <Link
          href="/brand"
          className={`hover:text-red-1 ${
            pathname === "/brand" && "text-red-1"
          }`}
        >
          BRAND
        </Link>
        <div
          className="relative"
          onMouseEnter={() => setIsDropdownVisible(true)}
          onMouseLeave={() => setIsDropdownVisible(false)}
        >
          <p className="relative text-gray-800 cursor-pointer hover:text-red-1">
            SHOP
          </p>
          {isDropdownVisible && (
            <div
              className="absolute left-1/2 transform -translate-x-1/2 top-full w-[20rem] bg-white shadow-lg transition-opacity duration-300 z-10 rounded-lg overflow-hidden"
              role="menu"
              aria-hidden={!isDropdownVisible}
            >
              <div className="grid grid-cols-2 gap-2 p-4">
                <div className="px-4 grid grid-cols-1 gap-2">
                  <h4 className="py-2 px-4 font-bold">Featured</h4>
                  <Link
                    href="/prota"
                    className="block py-2 px-4 hover:bg-amber-800 hover:text-white rounded-md"
                  >
                    Prota
                  </Link>
                  <Link
                    href="/best_sellers"
                    className="block py-2 px-4 hover:bg-amber-800 hover:text-white rounded-md"
                  >
                    Best Sellers
                  </Link>
                  <Link
                    href="/shop_all"
                    className="block py-2 px-4 hover:bg-amber-800 hover:text-white rounded-md"
                  >
                    Shop All
                  </Link>
                  <Link
                    href="/new_arrivals"
                    className="block py-2 px-4 hover:bg-amber-800 hover:text-white rounded-md"
                  >
                    New Arrivals
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <h4 className="py-2 px-4 font-bold">Categories</h4>
                </div>
              </div>
            </div>
          )}
        </div>
        <Link
          href={user ? "/wishlist" : "/sign-in"}
          className={`hover:text-red-1 ${
            pathname === "/wishlist" && "text-red-1"
          }`}
        >
          WISHLIST
        </Link>
        <Link
          href={user ? "/orders" : "/sign-in"}
          className={`hover:text-red-1 ${
            pathname === "/orders" && "text-red-1"
          }`}
        >
          ORDERS
        </Link>
      </div>
    );
  }
);

const MobileMenu: FC<MobileMenuProps> = React.memo(
  ({ isOpen, toggleMenu, toggleShopDropdown, isShopDropdownVisible, user }) =>
    isOpen && (
      <div className="lg:hidden bg-gray-400 flex flex-col items-start mt-4 text-white p-4 rounded-lg shadow-lg">
        <Link
          href="/"
          className="block p-1 hover:text-white hover:bg-gray-500 w-full text-left"
        >
          HOME
        </Link>
        <Link
          href="/brand"
          className="block p-1 hover:text-white hover:bg-gray-500 w-full text-left"
        >
          BRAND
        </Link>
        <Link
          href={user ? "/wishlist" : "/sign-in"}
          className="block p-1 hover:text-white hover:bg-gray-500 w-full text-left"
        >
          WISHLIST
        </Link>
        <Link
          href={user ? "/orders" : "/sign-in"}
          className="block p-1 hover:text-white hover:bg-gray-500 w-full text-left"
        >
          ORDERS
        </Link>
        <button
          onClick={toggleShopDropdown}
          className="block p-1 hover:text-white hover:bg-gray-500 w-full text-left"
        >
          SHOP
        </button>
        {isShopDropdownVisible && (
          <div className="lg:hidden flex flex-col items-start mt-4 bg-gray-500 p-2 rounded-lg shadow-lg">
            <h4 className="font-semibold text-lg p-1 text-gray-400">SHOP</h4>
            <Link
              href="/best_sellers"
              className="block p-1 hover:text-white hover:bg-gray-400"
            >
              Best Sellers
            </Link>
            <Link
              href="/shop_all"
              className="block p-1 hover:text-white hover:bg-gray-400"
            >
              Shop All
            </Link>
            <Link
              href="/new_arrivals"
              className="block p-1 hover:text-white hover:bg-gray-400"
            >
              New Arrivals
            </Link>
          </div>
        )}
        <div className="py-2">
          <CurrencySelector />
        </div>
      </div>
    )
);

const Navbar: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const cart = useCart();
  const user = session?.user;
  const avatar = user?.avatar || "/avartar.png";
  const name = user?.name || "User";

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isShopDropdownVisible, setIsShopDropdownVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleShopDropdown = () =>
    setIsShopDropdownVisible(!isShopDropdownVisible);

  return (
    <div className="sticky top-0 z-10 bg-gray-200 text-amber-950 py-2 px-5 max-sm:px-2">
      <div className="flex justify-between items-center max-sm:gap-2">
        <div className="lg:hidden flex items-center">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? (
              <X className="h-8 w-8 cursor-pointer" />
            ) : (
              <Menu className="h-8 w-8 cursor-pointer" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex">
          <CurrencySelector />
        </div>

        <Logo />

        <div className="flex items-center gap-3 max-sm:gap-1">
          <button onClick={() => setIsSearchVisible(true)}>
            <Search className="cursor-pointer h-6 w-6 hover:text-white" />
          </button>
          <Link
            href="/cart"
            className="flex items-center gap-2 border rounded-lg px-2 py-1 hover:bg-amber-950 hover:text-white max-sm:px-1 max-sm:py-1"
          >
            <ShoppingCart />
            <p className="text-base-bold max-sm:text-sm">
              ({cart.cartItems.length})
            </p>
          </Link>
          <div className="hidden lg:flex items-center">
            {user ? (
              <Link
                href="/profile"
                className="flex gap-4 items-center group relative"
              >
                <Image
                  src={avatar}
                  alt={`${name}'s avatar`}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                {/* Hover text below the avatar */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-full left-0 mt-2 text-blue-1">
                  {name}
                </span>
              </Link>
            ) : (
              <Link href="/sign-in">
                <CircleUserRound />
              </Link>
            )}
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        toggleShopDropdown={toggleShopDropdown}
        isShopDropdownVisible={isShopDropdownVisible}
        user={user}
      />

      {isSearchVisible && (
        <div className="fixed inset-0 bg-gray-200 text-amber-950 bg-opacity-90 z-20 flex flex-col items-center justify-center">
          <div className="w-full max-w-lg px-4">
            <div className="relative flex items-center border border-grey-2 px-3 py-1 rounded-lg">
              <input
                className="outline-none w-full"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                disabled={query === ""}
                onClick={() => {
                  router.push(`/search/${query}`);
                  setIsSearchVisible(false);
                }}
              >
                <Search className="cursor-pointer h-4 w-4 hover:text-red-1" />
              </button>
            </div>
            <button
              onClick={() => setIsSearchVisible(false)}
              className="absolute top-2 right-4 text-white hover:text-amber-950"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      <DesktopNavLinks pathname={pathname} user={user} />
    </div>
  );
};

export default Navbar;
function setIsDropdownVisible(arg0: boolean): void {
  throw new Error("Function not implemented.");
}
