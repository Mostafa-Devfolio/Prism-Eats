import {
  getDashboardStats,
  getChartData,
  getRecentOrders,
} from "./products/actions";
import {
  ShoppingBag,
  ClipboardList,
  DollarSign,
  TrendingUp,
  Clock,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [stats, chartData, recentOrders] = await Promise.all([
    getDashboardStats(),
    getChartData(),
    getRecentOrders(),
  ]);

  const maxChartValue = Math.max(...chartData.map((d) => d.total), 1);

  const cards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Menu Items",
      value: stats.totalProducts,
      icon: ShoppingBag,
      color: "text-[#D64C1E]",
      bg: "bg-[#FCEFE6]",
    },
  ];

  return (
    <div className="p-4 sm:p-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1310]">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm font-medium text-[#6B5D4F]">
            Welcome back! Here is what is happening with PRISM Eats today.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="flex items-center justify-between rounded-3xl bg-white p-6 shadow-[0_10px_40px_-15px_rgba(20,12,8,0.05)] border border-[#F0E9DB]"
              >
                <div className="space-y-2">
                  <span className="text-sm font-bold text-[#6B5D4F]">
                    {card.title}
                  </span>
                  <h2 className="text-3xl font-black text-[#1A1310]">
                    {card.value}
                  </h2>
                </div>
                <div className={`rounded-2xl ${card.bg} ${card.color} p-4`}>
                  <Icon size={24} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 1. Bar Chart (Tailwind Custom) */}
          <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-[0_10px_40px_-15px_rgba(20,12,8,0.05)] border border-[#F0E9DB]">
            <div className="mb-8 flex items-center gap-2">
              <TrendingUp className="text-[#D64C1E]" size={20} />
              <h2 className="text-lg font-bold text-[#1A1310]">
                Revenue (Last 7 Days)
              </h2>
            </div>

            <div className="flex h-56 items-end gap-2 sm:gap-4">
              {chartData.map((day) => (
                <div
                  key={day.name}
                  className="group relative flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <div className="relative flex w-full flex-1 items-end justify-center overflow-hidden rounded-t-xl bg-[#FCEFE6]/50">
                    {/* Tooltip بيظهر لما تقف بالماوس على العمود */}
                    <div className="absolute -top-10 z-10 hidden rounded-lg bg-[#1A1310] px-3 py-1.5 text-xs font-bold text-white shadow-lg group-hover:block">
                      ${day.total.toFixed(2)}
                      {/* السهم الصغير للـ Tooltip */}
                      <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#1A1310]"></div>
                    </div>

                    <div
                      className="w-full rounded-t-xl bg-[#D64C1E] transition-all duration-700 ease-out group-hover:bg-[#B83C14]"
                      style={{
                        height: `${(day.total / maxChartValue) * 100}%`,
                        minHeight: day.total > 0 ? "10%" : "0",
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-[#6B5D4F]">
                    {day.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_-15px_rgba(20,12,8,0.05)] border border-[#F0E9DB]">
            <div className="mb-6 flex items-center gap-2">
              <Clock className="text-[#D64C1E]" size={20} />
              <h2 className="text-lg font-bold text-[#1A1310]">
                Recent Orders
              </h2>
            </div>

            {recentOrders.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#E5DACB] text-sm text-[#A89A87]">
                No orders yet.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-2xl border border-[#F0E9DB] p-4 transition-colors hover:bg-[#FBF6EE]"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-[#1A1310]">
                        {order.customerName}
                      </p>
                      <p className="text-xs font-semibold text-[#6B5D4F]">
                        {order.createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-extrabold text-[#D64C1E]">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
