"use client";

import { useState, useEffect } from "react";
import AddProductForm from "./AddProductForm";
import Image from "next/image";
import { Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import { getPaginatedProducts } from "./actions";
import { Product } from "@/interfaces/ProductInterface";
import { toast } from "react-hot-toast";

export default function AdminProductsPage({
}: {
  params: Promise<{ locale: string }>;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const fetchProducts = async (page: number) => {
    setLoading(true);
    try {
      const data = await getPaginatedProducts(page, ITEMS_PER_PAGE);
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function ready() {
      fetchProducts(currentPage);
    }
    ready();
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-[#FBF6EE] p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* هيدر الصفحة */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1310]">
            Manage Products
          </h1>
          <p className="mt-2 text-sm font-medium text-[#6B5D4F]">
            Add new items to your menu, edit existing ones and view them live.
          </p>
        </div>

        {/* فورم الإضافة والتعديل */}
        <section>
          <AddProductForm
            editingProduct={editingProduct}
            onCancelEdit={() => {
              setEditingProduct(null);
              fetchProducts(currentPage); // تحديث القائمة بعد التعديل
            }}
          />
        </section>

        {/* عرض المنتجات الحالية */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#1A1310]">
              Current Menu ({totalItems})
            </h2>
            <button
              onClick={() => fetchProducts(currentPage)}
              className="text-sm font-bold text-[#D64C1E] hover:underline"
            >
              Refresh List
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E5DACB] border-t-[#D64C1E]"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex rounded-3xl border border-dashed border-[#E5DACB] bg-white p-10 text-center">
              <p className="w-full text-[#A89A87]">
                No products found. Add your first product above!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(20,12,8,0.06)] transition-transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 w-full bg-[#EFE6D6]">
                      {product.imageUrl && (
                        <Image
                          src={product.imageUrl}
                          alt={product.nameEn}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="line-clamp-1 font-bold text-[#1A1310]">
                            {product.nameEn}
                          </h3>
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="rounded-full bg-[#FBF6EE] p-2 text-[#6B5D4F] transition-colors hover:bg-[#D64C1E] hover:text-white"
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                        <h3
                          className="line-clamp-1 text-sm font-medium text-[#6B5D4F]"
                          dir="rtl"
                        >
                          {product.nameAr}
                        </h3>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-[#F0E9DB] pt-3">
                        <span className="font-mono text-lg font-extrabold text-[#D64C1E]">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* أزرار الـ Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1A1310] shadow-sm transition-colors hover:bg-[#F0E9DB] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm font-bold text-[#6B5D4F]">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1A1310] shadow-sm transition-colors hover:bg-[#F0E9DB] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
