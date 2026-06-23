"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { User, Loader2, CheckCircle2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { updateUserProfile } from "./actions";
import { useSession } from "next-auth/react";

interface ProfileFormProps {
  currentName: string;
  email: string;
}

function ProfileFormComponent({ currentName }: ProfileFormProps) {
  const locale = useLocale();
  const [name, setName] = useState(currentName || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const result = await updateUserProfile(name, locale);

    if (result.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error(result.error || "Something went wrong.");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Toaster position="top-center" />
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-semibold text-[#6B5D4F]"
        >
          Email (Cannot be changed)
        </label>
        <input
          disabled
          type="email"
          value={session?.user.email ?? ""}
          className="w-full rounded-xl border border-[#E5DACB] bg-[#F0E9DB] py-2.5 px-4 text-sm text-[#A89A87] cursor-not-allowed"
        />
      </div>

      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-semibold text-[#1A1310]"
        >
          Full Name
        </label>
        <div className="relative">
          <User
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89A87]"
          />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-[#E5DACB] bg-[#FBF6EE] py-2.5 pl-10 pr-4 text-sm text-[#1A1310] outline-none transition-colors focus:border-[#D64C1E] focus:ring-2 focus:ring-[#D64C1E]/20"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || name === currentName}
        className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#1A1310] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#33261F] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <CheckCircle2 size={18} />
        )}
        Save Changes
      </button>
    </form>
  );
}

export default React.memo(ProfileFormComponent);
