"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { use } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Home,
} from "lucide-react";

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Dashboard",
      href: `/${locale}/admin`,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Products",
      href: `/${locale}/admin/products`,
      icon: ShoppingBag,
      exact: false,
    },
    {
      label: "Orders",
      href: `/${locale}/admin/orders`,
      icon: ClipboardList,
      exact: false,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#FBF6EE]">
      <aside className="sticky top-0 h-screen w-64 border-r border-[#E5DACB] bg-white p-5 shadow-[2px_0_10px_rgba(20,12,8,0.02)]">
        <div className="mb-8">
          <Link
            href={`/${locale}`}
            className="text-xl font-extrabold tracking-tight text-[#D64C1E]"
          >
            PRISM<span className="text-[#1A1310]">Admin</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? "bg-[#FCEFE6] text-[#D64C1E] shadow-xs" // الستايل النشط
                    : "text-[#6B5D4F] hover:bg-[#FCEFE6]/50 hover:text-[#D64C1E]" // الستايل الطبيعي
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-[#D64C1E]" : "text-[#A89A87]"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5">
          <Link
            href={`/${locale}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#E5DACB] bg-[#FBF6EE] py-2.5 text-xs font-bold text-[#1A1310] transition-colors hover:bg-[#F0E9DB]"
          >
            <Home size={14} />
            Back to Shop
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
