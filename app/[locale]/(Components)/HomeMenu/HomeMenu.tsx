"use client";

import { useState } from "react";
import MenuGrid from "../MenuGrid/MenuGrid";
import { Product } from "@/interfaces/ProductInterface";
import { getHomeProducts } from "../../actions";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface HomeMenuProps {
  initialProducts: Product[];
  initialHasMore: boolean;
}

export default function HomeMenu({
  initialProducts,
  initialHasMore,
}: HomeMenuProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const res = await getHomeProducts(nextPage, 8);

      setProducts((prev) => [...prev, ...res.products]);
      setPage(nextPage);
      setHasMore(res.hasMore);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <MenuGrid products={products} />

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-full border-2 border-[#D64C1E] bg-transparent px-8 py-3 text-sm font-bold text-[#D64C1E] transition-all hover:bg-[#D64C1E] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Loading...
              </>
            ) : (
              "Load More Products"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
