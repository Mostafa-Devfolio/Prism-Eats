"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import {
  Loader2,
  Plus,
  Image as ImageIcon,
  DollarSign,
  Type,
  FileText,
  Check,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { addProduct, updateProduct } from "./actions";
import { Product } from "@/interfaces/ProductInterface";

interface AddProductFormProps {
  editingProduct: Product | null;
  onCancelEdit: () => void;
}

export default function AddProductForm({
  editingProduct,
  onCancelEdit,
}: AddProductFormProps) {
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const resetLocalState = () => {
    setNameEn("");
    setNameAr("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    formRef.current?.reset();
  };

  useEffect(() => {
    function getReady() {
      if (editingProduct) {
        setNameEn(editingProduct.nameEn || "");
        setNameAr(editingProduct.nameAr || "");
        setDescription(editingProduct.description || "");
        setPrice(editingProduct.price?.toString() || "");
        setImageUrl(editingProduct.imageUrl || "");
      } else {
        resetLocalState();
      }
    }
    getReady();
  }, [editingProduct]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = {
      nameEn,
      nameAr,
      description,
      price: parseFloat(price),
      imageUrl,
    };

    if (!data.nameEn || !data.nameAr || !data.price || !data.imageUrl) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, data, locale);
    } else {
      result = await addProduct(data, locale);
    }

    if (result.success) {
      toast.success(
        editingProduct
          ? "Product updated successfully!"
          : "Product added successfully!",
      );
      resetLocalState();
      if (editingProduct) onCancelEdit();
    } else {
      toast.error(result.error || "Something went wrong.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-[0_10px_40px_-15px_rgba(20,12,8,0.15)] sm:p-8">
      <Toaster position="top-center" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A1310]">
            {editingProduct ? "Edit Existing Product" : "Add New Product"}
          </h2>
          <p className="mt-1 text-sm text-[#6B5D4F]">
            {editingProduct
              ? "Modify the product details below"
              : "Expand your menu with new delicious items"}
          </p>
        </div>
        {editingProduct && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-500 transition-colors hover:bg-red-100"
          >
            <X size={14} /> Cancel Edit
          </button>
        )}
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* English Name */}
          <div>
            <label
              htmlFor="nameEn"
              className="mb-1.5 block text-sm font-semibold text-[#1A1310]"
            >
              Name (English) *
            </label>
            <div className="relative">
              <Type
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89A87]"
              />
              <input
                required
                id="nameEn"
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Classic Burger"
                className="w-full rounded-xl border border-[#E5DACB] bg-[#FBF6EE] py-2.5 pl-10 pr-4 text-sm text-[#1A1310] outline-none transition-colors focus:border-[#D64C1E] focus:ring-2 focus:ring-[#D64C1E]/20"
              />
            </div>
          </div>

          {/* Arabic Name */}
          <div>
            <label
              htmlFor="nameAr"
              className="mb-1.5 block text-sm font-semibold text-[#1A1310]"
            >
              Name (Arabic) *
            </label>
            <div className="relative">
              <Type
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89A87]"
              />
              <input
                required
                id="nameAr"
                type="text"
                dir="rtl"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: برجر كلاسيك"
                className="w-full rounded-xl border border-[#E5DACB] bg-[#FBF6EE] py-2.5 pl-10 pr-4 text-sm text-[#1A1310] outline-none transition-colors focus:border-[#D64C1E] focus:ring-2 focus:ring-[#D64C1E]/20"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-semibold text-[#1A1310]"
          >
            Description
          </label>
          <div className="relative">
            <FileText
              size={18}
              className="absolute left-3.5 top-3 text-[#A89A87]"
            />
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the item..."
              className="w-full resize-none rounded-xl border border-[#E5DACB] bg-[#FBF6EE] py-2.5 pl-10 pr-4 text-sm text-[#1A1310] outline-none transition-colors focus:border-[#D64C1E] focus:ring-2 focus:ring-[#D64C1E]/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="mb-1.5 block text-sm font-semibold text-[#1A1310]"
            >
              Price ($) *
            </label>
            <div className="relative">
              <DollarSign
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89A87]"
              />
              <input
                required
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-[#E5DACB] bg-[#FBF6EE] py-2.5 pl-10 pr-4 text-sm text-[#1A1310] outline-none transition-colors focus:border-[#D64C1E] focus:ring-2 focus:ring-[#D64C1E]/20"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="imageUrl"
              className="mb-1.5 block text-sm font-semibold text-[#1A1310]"
            >
              Image URL *
            </label>
            <div className="relative">
              <ImageIcon
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89A87]"
              />
              <input
                required
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-[#E5DACB] bg-[#FBF6EE] py-2.5 pl-10 pr-4 text-sm text-[#1A1310] outline-none transition-colors focus:border-[#D64C1E] focus:ring-2 focus:ring-[#D64C1E]/20"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-2 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
            editingProduct
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-[#D64C1E] hover:bg-[#B83C14]"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {editingProduct ? "Updating Product..." : "Saving Product..."}
            </>
          ) : (
            <>
              {editingProduct ? <Check size={18} /> : <Plus size={18} />}
              {editingProduct ? "Update Product" : "Add Product"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
