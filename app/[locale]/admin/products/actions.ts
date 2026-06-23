"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export interface ProductInput {
  nameEn: string;
  nameAr: string;
  description: string;
  price: number;
  imageUrl: string;
}

export async function addProduct(data: ProductInput, locale: string) {
  try {
    await prisma.product.create({
      data: {
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
      },
    });

    revalidatePath(`/${locale}/admin`);
    return { success: true };
  } catch (error) {
    console.error("Failed to add product:", error);
    return { success: false, error: "Failed to add product to database." };
  }
}

export async function updateProduct(
  id: string,
  data: ProductInput,
  locale: string,
) {
  try {
    await prisma.product.update({
      where: { id },
      data: {
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
      },
    });

    revalidatePath(`/${locale}/admin`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product in database." };
  }
}

export async function getPaginatedProducts(page: number, limit: number) {
  try {
    const skip = (page - 1) * limit;

    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count(),
    ]);

    return {
      products,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { products: [], totalPages: 0, totalItems: 0 };
  }
}

export async function getDashboardStats() {
  try {
    const [totalProducts, totalOrders, orders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.findMany({ select: { totalAmount: true } }),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalProducts,
      totalOrders,
      totalRevenue,
    };
  } catch (error) {
    console.error("Failed to get stats:", error);
    return { totalProducts: 0, totalOrders: 0, totalRevenue: 0 };
  }
}

export async function getChartData() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { totalAmount: true, createdAt: true },
    });

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dataMap = new Map();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dataMap.set(days[d.getDay()], 0);
    }

    orders.forEach((order) => {
      const dayName = days[order.createdAt.getDay()];
      if (dataMap.has(dayName)) {
        dataMap.set(dayName, dataMap.get(dayName) + order.totalAmount);
      }
    });

    return Array.from(dataMap, ([name, total]) => ({ name, total }));
  } catch (error) {
    console.error("Failed to fetch chart data:", error);
    return [];
  }
}

export async function getRecentOrders() {
  try {
    return await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        customerName: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch recent orders:", error);
    return [];
  }
}