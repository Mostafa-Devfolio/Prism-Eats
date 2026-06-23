"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Plus, Flame, Minus, Trash2 } from "lucide-react";
import { Product } from "@/interfaces/ProductInterface";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { addItem, decreaseItem } from "@/store/cartSlice/cartSlice";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

function ProductCardComponent({ product }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations("menu");
  const name = locale === "ar" ? product.nameAr : product.nameEn;

  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    function ready() {
      setIsMounted(true);
    }
    ready()
  }, []);

  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: product.id,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        price: product.price,
        imageUrl: product.imageUrl || "",
      }),
    );
    toast.success(`${product.nameEn} added to cart!`);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#FBF6EE] shadow-[0_2px_10px_rgba(20,12,8,0.08)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_18px_30px_-10px_rgba(214,76,30,0.35)]">
      {/* Image */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#EFE6D6]">
        <Image
          src={product.imageUrl ?? ""}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Price */}
        <div className="absolute bottom-3 ltr:right-3 rtl:left-3 rounded-full bg-[#1A1310]/90 px-3.5 py-1.5 backdrop-blur-sm">
          <span className="font-mono text-sm font-bold tracking-tight text-[#FBF6EE]">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3
          className="line-clamp-1 text-lg font-extrabold leading-tight text-[#1A1310]"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          {name}
        </h3>

        {product.description && (
          <p className="line-clamp-2 text-sm leading-snug text-[#6B5D4F]">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#D64C1E]">
            <Flame size={14} strokeWidth={2.5} />
            {t("fresh")}
          </div>

          {isMounted && quantity > 0 ? (
            <div className="flex h-10 items-center justify-between gap-2 rounded-full bg-[#F0E9DB] p-1 shadow-inner">
              <button
                onClick={() => dispatch(decreaseItem(product.id))}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1A1310] shadow-sm transition-transform active:scale-95 hover:text-red-500"
              >
                {quantity === 1 ? <Trash2 size={15} /> : <Minus size={16} />}
              </button>

              <span className="min-w-6 text-center font-bold text-[#1A1310]">
                {quantity}
              </span>

              <button
                onClick={handleAddToCart}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D64C1E] text-white shadow-sm transition-transform active:scale-95 hover:bg-[#B83C14]"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex h-10 items-center gap-1.5 rounded-full bg-[#D64C1E] px-4 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#B83C14] hover:shadow-md active:scale-95"
            >
              <Plus size={16} strokeWidth={3} />
              <span>{t("addToCart")}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProductCardComponent);
