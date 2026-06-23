import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";

const prisma = new PrismaClient();

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect(`/${locale}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen bg-[#FBF6EE] p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-extrabold text-[#1A1310]">
          My Account
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Account Details */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl bg-white p-6 shadow-[0_2px_10px_rgba(20,12,8,0.08)]">
              <h2 className="mb-6 text-xl font-bold text-[#1A1310]">
                Profile Details
              </h2>
              <ProfileForm currentName={user.name || ""} email={user.email} />
            </div>
          </div>

          {/* Orders Details */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-6 shadow-[0_2px_10px_rgba(20,12,8,0.08)]">
              <h2 className="mb-6 text-xl font-bold text-[#1A1310]">
                Order History
              </h2>

              {user.orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5DACB] bg-[#FBF6EE] py-12 text-center">
                  <Package
                    size={48}
                    className="mb-4 text-[#A89A87]"
                    strokeWidth={1.5}
                  />
                  <p className="text-lg font-bold text-[#1A1310]">
                    No orders yet
                  </p>
                  <p className="text-sm text-[#6B5D4F]">
                    Looks like you haven&apos;t placed any orders.
                  </p>
                  <Link
                    href={`/${locale}`}
                    className="mt-4 rounded-full bg-[#D64C1E] px-6 py-2 text-sm font-bold text-white hover:bg-[#B83C14]"
                  >
                    Start Ordering
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {user.orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-2xl border border-[#F0E9DB] p-4 hover:bg-[#FBF6EE] transition-colors"
                    >
                      <div>
                        <p className="font-mono text-sm font-bold text-[#1A1310]">
                          #{order.id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-xs text-[#6B5D4F]">
                          {new Intl.DateTimeFormat(
                            locale === "ar" ? "ar-EG" : "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          ).format(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-[#1A1310]">
                            ${order.totalAmount.toFixed(2)}
                          </p>
                          <p
                            className={`text-xs font-bold uppercase ${
                              order.status === "DELIVERED"
                                ? "text-green-600"
                                : order.status === "PREPARING"
                                  ? "text-blue-600"
                                  : "text-[#D64C1E]"
                            }`}
                          >
                            {order.status}
                          </p>
                        </div>
                        <Link
                          href={`/${locale}/orders/${order.id}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFE6D6] text-[#1A1310] hover:bg-[#D64C1E] hover:text-white transition-colors"
                        >
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
