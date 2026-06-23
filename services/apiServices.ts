import { IRegister } from "@/interfaces/AuthInterface";
import { IOrder } from "@/interfaces/OrderInterface";


export async function createOrder(orderData: IOrder) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to place order.");
  }

  return data;
}

export const registerUser = async (userData: IRegister) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Registration failed.");
  }

  return data;
};
