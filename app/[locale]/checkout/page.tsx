"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Banknote,
  CreditCard,
  Loader2,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { selectCartTotal, clearCart } from "../../../store/cartSlice/cartSlice";
import { createOrder } from "@/services/apiServices";

const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name is too long."),
  customerPhone: z
    .string()
    .min(8, "Enter a valid phone number.")
    .regex(/^[0-9+\s-]+$/, "Phone number contains invalid characters."),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters.")
    .max(300, "Address is too long."),
  paymentMethod: z.union([z.literal("COD"), z.literal("ONLINE")], {
    message: "Select a payment method.",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const PAYMENT_OPTIONS: {
  value: "COD" | "ONLINE";
  label: string;
  description: string;
  icon: typeof Banknote;
}[] = [
  {
    value: "COD",
    label: "Cash on Delivery",
    description: "Pay with cash when your order arrives",
    icon: Banknote,
  },
  {
    value: "ONLINE",
    label: "Online Payment",
    description: "Pay securely with card or wallet",
    icon: CreditCard,
  },
];

function CheckoutFormComponent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useAppSelector((state) => state.cart.items);
  const totalAmount = useAppSelector(selectCartTotal);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      address: "",
      paymentMethod: "COD",
    },
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        address: values.address,
        paymentMethod: values.paymentMethod,
        totalAmount,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await createOrder(orderPayload);

      toast.success("Order placed successfully!");
      dispatch(clearCart());
      router.push("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-[0_10px_40px_-15px_rgba(20,12,8,0.15)] sm:p-8">
      <Toaster position="top-center" />

      <h2 className="mb-6 text-xl font-extrabold text-[#1A1310]">
        Delivery details
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5"
      >
        <div>
          <label
            htmlFor="customerName"
            className="mb-1.5 block text-sm font-semibold text-[#1A1310]"
          >
            Full name
          </label>
          <div className="relative">
            <User
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89A87]"
            />
            <input
              id="customerName"
              type="text"
              {...register("customerName")}
              placeholder="John Doe"
              className={`w-full rounded-xl border bg-[#FBF6EE] py-2.5 pl-10 pr-4 text-sm text-[#1A1310] outline-none transition-colors focus:border-[#D64C1E] focus:ring-2 focus:ring-[#D64C1E]/20 ${
                errors.customerName ? "border-red-400" : "border-[#E5DACB]"
              }`}
            />
          </div>
          {errors.customerName && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors.customerName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="customerPhone"
            className="mb-1.5 block text-sm font-semibold text-[#1A1310]"
          >
            Phone number
          </label>
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89A87]"
            />
            <input
              id="customerPhone"
              type="tel"
              {...register("customerPhone")}
              placeholder="+20 100 123 4567"
              className={`w-full rounded-xl border bg-[#FBF6EE] py-2.5 pl-10 pr-4 text-sm text-[#1A1310] outline-none transition-colors focus:border-[#D64C1E] focus:ring-2 focus:ring-[#D64C1E]/20 ${
                errors.customerPhone ? "border-red-400" : "border-[#E5DACB]"
              }`}
            />
          </div>
          {errors.customerPhone && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors.customerPhone.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="address"
            className="mb-1.5 block text-sm font-semibold text-[#1A1310]"
          >
            Delivery address
          </label>
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-3.5 top-3 text-[#A89A87]"
            />
            <textarea
              id="address"
              rows={3}
              {...register("address")}
              placeholder="Street, building, floor, apartment, city..."
              className={`w-full resize-none rounded-xl border bg-[#FBF6EE] py-2.5 pl-10 pr-4 text-sm text-[#1A1310] outline-none transition-colors focus:border-[#D64C1E] focus:ring-2 focus:ring-[#D64C1E]/20 ${
                errors.address ? "border-red-400" : "border-[#E5DACB]"
              }`}
            />
          </div>
          {errors.address && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors.address.message}
            </p>
          )}
        </div>

        <div>
          <span className="mb-2 block text-sm font-semibold text-[#1A1310]">
            Payment method
          </span>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-3">
                {PAYMENT_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = field.value === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                        isSelected
                          ? "border-[#D64C1E] bg-[#FCEFE6]"
                          : "border-[#E5DACB] bg-[#FBF6EE] hover:border-[#D9CDBB]"
                      }`}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        checked={isSelected}
                        onChange={() => field.onChange(option.value)}
                        className="mt-1 h-4 w-4 accent-[#D64C1E]"
                      />
                      <Icon
                        size={20}
                        className={
                          isSelected ? "text-[#D64C1E]" : "text-[#A89A87]"
                        }
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#1A1310]">
                          {option.label}
                        </span>
                        <span className="text-xs text-[#6B5D4F]">
                          {option.description}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          />
          {errors.paymentMethod && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#F0E9DB] pt-4">
          <span className="text-sm font-semibold text-[#6B5D4F]">Total</span>
          <span className="text-lg font-extrabold text-[#1A1310]">
            ${totalAmount.toFixed(2)}
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#D64C1E] py-3 text-sm font-bold text-white transition-colors hover:bg-[#B83C14] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Placing order...
            </>
          ) : (
            "Place order"
          )}
        </button>
      </form>
    </div>
  );
}

export default React.memo(CheckoutFormComponent);
