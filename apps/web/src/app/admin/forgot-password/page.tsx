"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      const res = await apiFetch<{ message: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ارسال درخواست");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-50 px-4">
      <div className="w-full max-w-sm rounded-card bg-white p-8 shadow-lg">
        <h1 className="mb-1 text-center text-xl font-bold text-navy-800">فراموشی رمز عبور</h1>
        <p className="mb-6 text-center text-sm text-navy-500">
          ایمیل حساب کاربری‌تان را وارد کنید تا لینک بازیابی برایتان ارسال شود.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@hemayatgar.ir"
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
          />

          {message && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>}
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-btn bg-navy-700 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60"
          >
            {isLoading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
          </button>
        </form>

        <Link href="/admin/login" className="mt-4 block text-center text-xs text-navy-500 hover:text-navy-700">
          بازگشت به صفحه ورود
        </Link>
      </div>
    </main>
  );
}
