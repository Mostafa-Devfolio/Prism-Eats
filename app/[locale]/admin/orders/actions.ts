"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export type OrderStatus = "PENDING" | "PREPARING" | "DELIVERED";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  locale: string,
) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath(`/${locale}/admin/orders`);
}
