"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export function AddArticleForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await apiFetch("/api/admin/articles", {
        method: "POST",
        body: JSON.stringify({ slug, title, excerpt, content }),
      });
      setIsOpen(false);
      setSlug("");
      setTitle("");
      setExcerpt("");
      setContent("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ثبت مقاله");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mb-4 rounded-btn bg-navy-800 px-4 py-2 text-sm text-white hover:bg-navy-900"
      >
        + مقاله جدید
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-card bg-white p-5 shadow-sm">
      <h2 className="mb-2 font-semibold text-navy-800">نوشتن مقاله جدید</h2>
      <input
        required
        placeholder="عنوان مقاله"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
      />
      <input
        required
        placeholder="نشانی انگلیسی (slug) — مثل: car-insurance-tips"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        dir="ltr"
        className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
      />
      <textarea
        placeholder="چکیده کوتاه (اختیاری)"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
      />
      <textarea
        required
        placeholder="متن کامل مقاله (HTML ساده)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={8}
        className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
      />
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-btn bg-navy-800 px-4 py-2 text-sm text-white hover:bg-navy-900 disabled:opacity-60"
        >
          {isLoading ? "در حال ثبت..." : "ذخیره به‌عنوان پیش‌نویس"}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-btn border border-navy-200 px-4 py-2 text-sm text-navy-600 hover:bg-navy-50"
        >
          انصراف
        </button>
      </div>
      <p className="text-xs text-navy-400">
        نکته: نوشتن مقاله با دستیار هوش مصنوعی معمولاً سریع‌تر و برای سئو بهتر است.
      </p>
    </form>
  );
}
