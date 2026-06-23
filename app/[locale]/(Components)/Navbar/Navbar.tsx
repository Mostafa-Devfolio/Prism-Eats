"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingCart,
  Globe,
  LogIn,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAppSelector } from "@/store/store";
import CartDrawer from "../CartDrawer/CartDrawer";

export default function Navbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    function ready() {
      setIsMounted(true);
    }
    ready();
  }, []);

  const cartItemCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    let newPath = pathname;
    if (pathname.startsWith(`/${locale}`)) {
      newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    } else {
      newPath = `/${nextLocale}${pathname}`;
    }
    router.push(newPath);
    router.refresh();
  };

  const handleCloseCart = useMemo(() => () => setIsCartOpen(false), []);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-[#E5DACB] bg-[#FBF6EE]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-[#D64C1E]">
              PRISM<span className="text-[#1A1310]">Eats</span>
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-[#1A1310] transition-colors hover:bg-[#F0E9DB]"
              aria-label="Toggle Language"
            >
              <Globe size={18} className="text-[#A89A87]" />
              <span className="uppercase">
                {locale === "en" ? "عربي" : "EN"}
              </span>
            </button>

            <Link
              href={`/${locale}/profile`}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-[#1A1310] transition-colors hover:bg-[#F0E9DB]"
            >
              <Globe size={18} className="text-[#A89A87]" />
              Orders
            </Link>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center rounded-full p-2 text-[#1A1310] transition-colors hover:bg-[#F0E9DB]"
            >
              <ShoppingCart size={22} />
              {isMounted && cartItemCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#D64C1E] text-[10px] font-bold text-white outline-2 outline-[#FBF6EE]">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            {status === "loading" ? (
              <div className="h-8 w-20 animate-pulse rounded-full bg-[#E5DACB]" />
            ) : session ? (
              <div className="flex items-center gap-3">
                {session.user?.role === "ADMIN" && (
                  <Link
                    href={`/${locale}/admin`}
                    className="flex items-center gap-1.5 rounded-full bg-[#D64C1E]/10 px-3 py-1.5 text-sm font-bold text-[#D64C1E] transition-colors hover:bg-[#D64C1E] hover:text-white"
                  >
                    <LayoutDashboard size={16} />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </Link>
                )}

                <Link
                  href={`/${locale}/profile`}
                  className="hidden flex-col items-end sm:flex hover:opacity-80 transition-opacity"
                >
                  <span className="text-sm font-bold text-[#1A1310]">
                    {session.user?.name || "User"}
                  </span>
                  <span className="text-xs font-bold text-[#6B5D4F] capitalize">
                    {session.user?.role?.toLowerCase() || "user"}
                  </span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  className="flex h-9 items-center justify-center rounded-full bg-[#F0E9DB] px-3 text-[#1A1310] transition-colors hover:bg-[#E5DACB] sm:h-10 sm:w-10 sm:p-0"
                  title="Log out"
                >
                  <LogOut size={18} />
                  <span className="ml-2 text-sm font-bold sm:hidden">
                    Logout
                  </span>
                </button>
              </div>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="flex items-center gap-2 rounded-full bg-[#1A1310] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#33261F]"
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={handleCloseCart} />
    </>
  );
}
