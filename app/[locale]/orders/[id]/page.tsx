import { PrismaClient } from "prisma/prisma-client";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, ChefHat, PackageCheck } from "lucide-react";
import Image from "next/image";

const prisma = new PrismaClient();

interface OrderTrackingProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function OrderTrackingPage({
  params,
}: OrderTrackingProps) {
  const { id, locale } = await params;

  // Fetch the order and include the product details for each item
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const steps = [
    { id: "PENDING", label: "Order Placed", icon: Clock },
    { id: "PREPARING", label: "Preparing", icon: ChefHat },
    { id: "DELIVERED", label: "Delivered", icon: PackageCheck },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === order.status);

  return (
    <div className="min-h-screen bg-[#FBF6EE] p-6 sm:p-10">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl bg-white p-6 shadow-[0_2px_10px_rgba(20,12,8,0.08)] sm:p-8">
          <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-extrabold text-[#1A1310]">
              Order #{order.id.slice(-6).toUpperCase()}
            </h1>
            <span className="inline-flex w-fit items-center rounded-full bg-[#FCEFE6] px-3 py-1.5 text-xs font-bold text-[#D64C1E]">
              {order.paymentMethod === "COD"
                ? "Cash on Delivery"
                : "Online Payment"}
            </span>
          </div>
          <p className="text-sm text-[#6B5D4F]">
            Placed on{" "}
            {new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(order.createdAt)}
          </p>
        </div>

        {/* Status Stepper */}
        <div className="rounded-3xl bg-white p-6 shadow-[0_2px_10px_rgba(20,12,8,0.08)] sm:p-8">
          <h2 className="mb-8 text-lg font-bold text-[#1A1310]">Track Order</h2>
          <div className="relative flex items-center justify-between px-2 sm:px-6">
            {/* Connecting Background Line */}
            <div className="absolute left-6 right-6 top-6 -z-10 h-1.5 -translate-y-1/2 rounded-full bg-[#F0E9DB]" />

            {/* Connecting Active Line */}
            <div
              className="absolute left-6 top-6 -z-10 h-1.5 -translate-y-1/2 rounded-full bg-[#D64C1E] transition-all duration-500 ease-out"
              style={{
                width: `calc(${(currentStepIndex / (steps.length - 1)) * 100}% - 3rem)`,
              }}
            />

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              const isCompleted = index < currentStepIndex;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center gap-3 bg-white px-2"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-4 transition-all duration-300 ${
                      isActive
                        ? "border-[#FCEFE6] bg-[#D64C1E] text-white shadow-md"
                        : "border-white bg-[#F0E9DB] text-[#A89A87]"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={22} strokeWidth={3} />
                    ) : (
                      <Icon size={22} strokeWidth={2.5} />
                    )}
                  </div>
                  <span
                    className={`text-center text-xs font-bold uppercase tracking-wide sm:text-sm ${
                      isActive ? "text-[#1A1310]" : "text-[#A89A87]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="rounded-3xl bg-white p-6 shadow-[0_2px_10px_rgba(20,12,8,0.08)] sm:p-8">
          <h2 className="mb-6 text-lg font-bold text-[#1A1310]">
            Order Summary
          </h2>
          <div className="divide-y divide-[#F0E9DB]">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                {item.product?.imageUrl ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#EFE6D6]">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.nameEn}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-2xl bg-[#F0E9DB]" />
                )}
                <div className="flex flex-1 flex-col">
                  <span className="font-bold text-[#1A1310]">
                    {locale === "ar"
                      ? item.product?.nameAr
                      : item.product?.nameEn}
                  </span>
                  <span className="text-sm font-medium text-[#6B5D4F]">
                    Qty: {item.quantity}
                  </span>
                </div>
                <span className="font-mono text-lg font-bold text-[#1A1310]">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-[#F0E9DB] pt-6">
            <span className="text-base font-bold text-[#6B5D4F]">
              Total Amount
            </span>
            <span className="text-3xl font-extrabold text-[#1A1310]">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
