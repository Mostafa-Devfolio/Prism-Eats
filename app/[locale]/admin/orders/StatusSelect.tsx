"use client";

import React, { useState, useTransition } from "react";
import { updateOrderStatus, OrderStatus } from "./actions";
import { useLocale } from "next-intl";

const STATUS_OPTIONS: OrderStatus[] = ["PENDING", "PREPARING", "DELIVERED"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-[#FCEFE3] text-[#B8631C] border-[#F0CDA0]",
  PREPARING: "bg-[#E9EEFB] text-[#3454A6] border-[#C4D2F0]",
  DELIVERED: "bg-[#E6F4E8] text-[#2C7A3D] border-[#BCE3C4]",
};

interface StatusSelectProps {
  orderId: string;
  currentStatus: string;
}

function StatusSelectComponent({ orderId, currentStatus }: StatusSelectProps) {
  const [status, setStatus] = useState<OrderStatus>(
    currentStatus as OrderStatus,
  );
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();

  const handleChange = (newStatus: OrderStatus) => {
    setStatus(newStatus);
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus, locale);
    });
  };

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide outline-none transition-opacity disabled:cursor-wait disabled:opacity-60 ${STATUS_STYLES[status]}`}
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default React.memo(StatusSelectComponent);
