"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function updateUserProfile(name: string, locale: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
    });

    // تحديث الصفحة عشان الاسم الجديد يظهر فوراً
    revalidatePath(`/${locale}/profile`);
    return { success: true };
  } catch (error) {
    console.error("Profile update failed:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
