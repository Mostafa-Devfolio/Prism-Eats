"use client";

import React from "react";
import { Product } from "@/interfaces/ProductInterface";
import { useTranslations } from "next-intl";
import ProductCard from "../ProductCard/ProductCard";

interface MenuGridProps {
  products: Product[];
}

export default React.memo(function MenuGrid({ products }: MenuGridProps) {
  const t = useTranslations("menu");

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-[#D9CDBB] bg-[#FBF6EE]/60 px-6 py-16 text-center">
        <p className="text-base font-semibold text-[#1A1310]">
          {t("emptyTitle")}
        </p>
        <p className="text-sm text-[#6B5D4F]">{t("emptyDescription")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
});
