  "use client";

  import { useState, FormEvent } from "react";
  import { signIn } from "next-auth/react";
  import { useRouter } from "next/navigation";
  import { Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
  import toast, { Toaster } from "react-hot-toast";
  import Link from "next/link";
  import { registerUser } from "@/services/apiServices";

  interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }

  export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = (): boolean => {
      const newErrors: FormErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name.trim()) {
        newErrors.name = "Full name is required.";
      }

      if (!email.trim()) {
        newErrors.email = "Email is required.";
      } else if (!emailRegex.test(email)) {
        newErrors.email = "Enter a valid email address.";
      }

      if (!password) {
        newErrors.password = "Password is required.";
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
      }

      if (confirmPassword !== password) {
        newErrors.confirmPassword = "Passwords do not match.";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      if (!validate()) {
        return;
      }

      setIsLoading(true);

      try {
        await registerUser({ name, email, password });

        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Account created, but sign in failed. Please log in.");
          router.push("/login");
          return;
        }

        toast.success("Account created successfully!");
        router.push("/");
        router.refresh();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBF6EE] px-4">
        <Toaster position="top-center" />

        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_10px_40px_-15px_rgba(20,12,8,0.15)]">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-extrabold text-[#1A1310]">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-[#6B5D4F]">
              Order your favorites in seconds
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <div>
              <label
                htmlFor="name"
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
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full rounded-xl border bg-[#FBF6EE] py-2.5 pl-10 pr-4 text-sm text-[#1A1310] outline-none transition-colors focus:border-[#D64C1E] focus:ring-2 focus:ring-[#D64C1E]/20 ${
                    errors.name ? "border-red-400" : "border-[#E5DACB]"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-[#1A1310]"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89A87]"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border bg-[#FBF6EE] py-2.5 pl-10 pr-4 text-sm text-[#1A1310] outline-none transition-colors focus:border-[#D64C1E] focus:ring-2 focus:ring-[#D64C1E]/20 ${
                    errors.email ? "border-red-400" : "border-[#E5DACB]"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-[#1A1310]"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89A87]"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-[#FBF6EE] py-2.5 pl-10 pr-10 text-sm text-[#1A1310] outline-none transition-colors focus:border-[#D64C1E] focus:ring-2 focus:ring-[#D64C1E]/20 ${
                    errors.password ? "border-red-400" : "border-[#E5DACB]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A89A87] hover:text-[#1A1310]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-semibold text-[#1A1310]"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89A87]"
                />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-[#FBF6EE] py-2.5 pl-10 pr-4 text-sm text-[#1A1310] outline-none transition-colors focus:border-[#D64C1E] focus:ring-2 focus:ring-[#D64C1E]/20 ${
                    errors.confirmPassword ? "border-red-400" : "border-[#E5DACB]"
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#D64C1E] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#B83C14] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6B5D4F]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#D64C1E] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }
