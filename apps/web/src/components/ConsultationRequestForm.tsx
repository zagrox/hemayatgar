"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface InsuranceCategoryOption {
  id: string;
  title: string;
}

interface ConsultationRequestFormProps {
  /** اگر از داخل صفحه یک رشته بیمه خاص استفاده می‌شود، این مقدار از قبل انتخاب می‌شود */
  defaultInsuranceCategoryId?: string;
}

export function ConsultationRequestForm({ defaultInsuranceCategoryId }: ConsultationRequestFormProps) {
  const [categories, setCategories] = useState<InsuranceCategoryOption[]>([]);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [insuranceCategoryId, setInsuranceCategoryId] = useState(defaultInsuranceCategoryId ?? "");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<InsuranceCategoryOption[]>("/api/insurance-categories")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      await apiFetch("/api/requests", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          mobile,
          insuranceCategoryId: insuranceCategoryId || undefined,
          description: description || undefined,
        }),
      });
      setStatus("success");
      setFullName("");
      setMobile("");
      setDescription("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "خطا در ثبت درخواست");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-card bg-green-50 p-6 text-center text-green-700">
        درخواست شما با موفقیت ثبت شد. کارشناسان ما در اسرع وقت با شما تماس می‌گیرند.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-card bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-navy-800">درخواست مشاوره رایگان</h3>

      <div>
        <label className="mb-1 block text-sm text-navy-600">نام و نام خانوادگی</label>
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-navy-600">شماره موبایل</label>
        <input
          required
          dir="ltr"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="09123456789"
          className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-navy-600">نوع بیمه</label>
        <select
          value={insuranceCategoryId}
          onChange={(e) => setInsuranceCategoryId(e.target.value)}
          className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        >
          <option value="">انتخاب کنید (اختیاری)</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm text-navy-600">توضیحات (اختیاری)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />
      </div>

      {errorMessage && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-btn bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-60"
      >
        {status === "loading" ? "در حال ارسال..." : "ثبت درخواست"}
      </button>
    </form>
  );
}
