// app/admin/orders/page.tsx
import { PrismaClient } from "@prisma/client";
import StatusSelect from "./StatusSelect";

const prisma = new PrismaClient();

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="min-h-screen bg-[#FBF6EE] p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-extrabold text-[#1A1310]">Orders</h1>

        <div className="overflow-hidden rounded-2xl border border-[#E5DACB] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-175 text-left">
              <thead>
                <tr className="border-b border-[#E5DACB] bg-[#F4EEE2]">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#6B5D4F]">
                    ID
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#6B5D4F]">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#6B5D4F]">
                    Total
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#6B5D4F]">
                    Date
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#6B5D4F]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#F0E9DB] last:border-0 hover:bg-[#FBF6EE]"
                  >
                    <td className="px-4 py-3 font-mono text-sm text-[#1A1310]">
                      #{order.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold text-[#1A1310]">
                        {order.customerName}
                      </div>
                      <div className="text-xs text-[#6B5D4F]">
                        {order.customerPhone}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-[#1A1310]">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6B5D4F]">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-sm text-[#6B5D4F]"
                    >
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
