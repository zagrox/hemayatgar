"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      const res = await apiFetch<{ message: string }>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      });
      setMessage(res.message);
      setTimeout(() => router.push("/admin/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در تغییر رمز عبور");
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
        لینک نامعتبر است. دوباره از صفحه فراموشی رمز عبور اقدام کنید.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="password"
        required
        minLength={6}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="رمز عبور جدید"
        className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
      />

      {message && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>}
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-btn bg-navy-700 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {isLoading ? "در حال ثبت..." : "تعیین رمز عبور جدید"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-50 px-4">
      <div className="w-full max-w-sm rounded-card bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-xl font-bold text-navy-800">تعیین رمز عبور جدید</h1>
        <Suspense fallback={<p className="text-center text-sm text-navy-400">در حال بارگذاری...</p>}>
          <ResetPasswordForm />
        </Suspense>
        <Link href="/admin/login" className="mt-4 block text-center text-xs text-navy-500 hover:text-navy-700">
          بازگشت به صفحه ورود
        </Link>
      </div>
    </main>
  );
}
