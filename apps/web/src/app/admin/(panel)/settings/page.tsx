"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface SiteSettings {
  siteName: string;
  siteTagline: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  address: string | null;
  workingHours: string | null;
  instagramUrl: string | null;
  telegramUrl: string | null;
  whatsappUrl: string | null;
  baleUrl: string | null;
  rubikaUrl: string | null;
  defaultSeoTitle: string | null;
  defaultSeoDescription: string | null;
  primaryColorHex: string;
  accentColorHex: string;
  fontFamily: string;
  logoUrl: string | null;
  heroImageUrl: string | null;
  heroSecondaryImageUrl: string | null;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<SiteSettings>("/api/admin/settings")
      .then(setSettings)
      .catch((err) => setError(err instanceof Error ? err.message : "خطا در دریافت تنظیمات"));
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!settings) return;
    setError(null);
    setMessage(null);
    try {
      const updated = await apiFetch<SiteSettings>("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(settings),
      });
      setSettings(updated);
      setMessage("تنظیمات با موفقیت ذخیره شد");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ذخیره تنظیمات");
    }
  }

  if (!settings) {
    return <p className="text-navy-500">در حال بارگذاری تنظیمات...</p>;
  }

  const fields: { key: keyof SiteSettings; label: string }[] = [
    { key: "siteName", label: "نام سایت" },
    { key: "siteTagline", label: "شعار سایت" },
    { key: "phone", label: "تلفن ثابت" },
    { key: "mobile", label: "موبایل" },
    { key: "email", label: "ایمیل" },
    { key: "address", label: "آدرس" },
    { key: "workingHours", label: "ساعات کاری" },
    { key: "instagramUrl", label: "لینک اینستاگرام" },
    { key: "telegramUrl", label: "لینک تلگرام" },
    { key: "whatsappUrl", label: "لینک واتساپ" },
    { key: "baleUrl", label: "لینک بله" },
    { key: "rubikaUrl", label: "لینک روبیکا" },
    { key: "defaultSeoTitle", label: "عنوان پیش‌فرض سئو" },
    { key: "defaultSeoDescription", label: "توضیحات پیش‌فرض سئو" },
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-navy-800">تنظیمات سایت</h1>

      {message && <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>}
      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-sm text-navy-600">{field.label}</label>
            <input
              value={settings[field.key] ?? ""}
              onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
              className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
            />
          </div>
        ))}
        <button className="rounded-lg bg-navy-700 px-4 py-2 text-sm text-white hover:bg-navy-800">
          ذخیره تنظیمات
        </button>
      </form>

      <div className="mt-8 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-navy-800">ظاهر سایت (رنگ، فونت، تصاویر)</h2>
        <p className="mb-4 text-xs text-navy-400">
          این تنظیمات بلافاصله و بدون نیاز به دیپلوی مجدد اعمال می‌شوند. راحت‌تر می‌تونی از دستیار
          هوش مصنوعی هم بخوای عوضشون کنه.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-navy-600">رنگ اصلی (سرمه‌ای)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.primaryColorHex}
                  onChange={(e) => setSettings({ ...settings, primaryColorHex: e.target.value })}
                  className="h-9 w-12 rounded border border-navy-200"
                />
                <input
                  value={settings.primaryColorHex}
                  onChange={(e) => setSettings({ ...settings, primaryColorHex: e.target.value })}
                  className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm text-navy-600">رنگ تاکیدی (نارنجی)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.accentColorHex}
                  onChange={(e) => setSettings({ ...settings, accentColorHex: e.target.value })}
                  className="h-9 w-12 rounded border border-navy-200"
                />
                <input
                  value={settings.accentColorHex}
                  onChange={(e) => setSettings({ ...settings, accentColorHex: e.target.value })}
                  className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-navy-600">فونت سایت</label>
            <select
              value={settings.fontFamily}
              onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
              className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
            >
              <option value="vazirmatn">Vazirmatn (پیش‌فرض)</option>
              <option value="noto">Noto Naskh Arabic</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-navy-600">آدرس لوگو</label>
            <input
              value={settings.logoUrl ?? ""}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              dir="ltr"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-navy-600">عکس هیرو اصلی صفحه اول</label>
            <input
              value={settings.heroImageUrl ?? ""}
              onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
              className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              dir="ltr"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-navy-600">عکس نماینده (سکشن چرا حمایتگر)</label>
            <input
              value={settings.heroSecondaryImageUrl ?? ""}
              onChange={(e) => setSettings({ ...settings, heroSecondaryImageUrl: e.target.value })}
              className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              dir="ltr"
            />
          </div>

          <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600">
            ذخیره ظاهر سایت
          </button>
        </form>
      </div>
    </div>
  );
}
