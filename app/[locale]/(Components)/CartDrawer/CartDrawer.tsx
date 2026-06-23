"use client";

import React, { useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import {
  addItem,
  removeItem,
  decreaseItem,
  selectCartTotal,
} from "../../../../store/cartSlice/cartSlice";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function CartDrawerComponent({ isOpen, onClose }: CartDrawerProps) {
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.cart.items);
  const totalAmount = useAppSelector(selectCartTotal);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    router.push(`/${locale}/checkout`);
  };

  return (
    <div
      className="fixed inset-0 z-100 flex"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div
        className="absolute inset-0 bg-[#1A1310]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`relative flex h-full w-full max-w-md flex-col bg-[#FBF6EE] shadow-[0_0_40px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-in-out ${
          locale === "ar" ? "ml-auto" : "mr-auto right-0 absolute"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5DACB] px-6 py-5">
          <div className="flex items-center gap-2 text-[#1A1310]">
            <ShoppingBag size={24} />
            <h2 className="text-xl font-extrabold">Your Cart</h2>
            <span className="ml-2 rounded-full bg-[#D64C1E] px-2.5 py-0.5 text-xs font-bold text-white">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#A89A87] transition-colors hover:bg-[#F0E9DB] hover:text-[#1A1310]"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-[#F0E9DB] p-6 text-[#A89A87]">
                <ShoppingBag size={48} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-[#1A1310]">
                  Your cart is empty
                </p>
                <p className="text-sm text-[#6B5D4F]">
                  Looks like you haven&apos;t added anything yet.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 rounded-full bg-[#1A1310] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#33261F]"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  {/* Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#EFE6D6]">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.nameEn}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col">
                    <h3 className="line-clamp-1 font-bold text-[#1A1310]">
                      {locale === "ar" ? item.nameAr : item.nameEn}
                    </h3>
                    <p className="font-mono text-sm font-bold text-[#D64C1E]">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Controls */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-[#E5DACB] bg-white">
                        <button
                          onClick={() => dispatch(decreaseItem(item.id))}
                          className="p-1.5 text-[#6B5D4F] transition-colors hover:bg-[#F0E9DB] hover:text-[#1A1310]"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="w-8 border-x border-[#E5DACB] text-center text-xs font-bold text-[#1A1310]">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => dispatch(addItem({ ...item }))}
                          className="p-1.5 text-[#6B5D4F] transition-colors hover:bg-[#F0E9DB] hover:text-[#1A1310]"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 ml-2"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="border-t border-[#E5DACB] bg-white p-6 shadow-[0_-10px_40px_-15px_rgba(20,12,8,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-base font-bold text-[#6B5D4F]">
                Subtotal
              </span>
              <span className="text-2xl font-extrabold text-[#1A1310]">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D64C1E] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#B83C14] shadow-sm"
            >
              Proceed to Checkout
              {locale === "ar" ? (
                <ArrowLeft size={18} />
              ) : (
                <ArrowRight size={18} />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(CartDrawerComponent);
