"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getHomeProducts(page: number, limit: number = 8) {
  try {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count(),
    ]);

    return {
      products,
      hasMore: skip + products.length < total,
    };
  } catch (error) {
    console.error("Failed to fetch home products:", error);
    return { products: [], hasMore: false };
  }
}
