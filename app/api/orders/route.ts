import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { CheckoutBody } from "@/interfaces/CheckoutInterface";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json();
    const {
      customerName,
      customerPhone,
      address,
      totalAmount,
      paymentMethod,
      items,
    } = body;

    if (
      !customerName ||
      !customerPhone ||
      !address ||
      !totalAmount ||
      !paymentMethod ||
      !items?.length
    ) {
      return NextResponse.json(
        { error: "Missing required checkout fields." },
        { status: 400 },
      );
    }

    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id ?? null;

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          customerName,
          customerPhone,
          address,
          totalAmount,
          paymentMethod,
          status: "PENDING",
        },
      });

      await tx.orderItem.createMany({
        data: items.map((item) => ({
          orderId: createdOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      return tx.order.findUnique({
        where: { id: createdOrder.id },
        include: { items: true },
      });
    });

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order." },
      { status: 500 },
    );
  }
}
