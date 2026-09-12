"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleProfileSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await apiFetch("/api/admin/profile", {
        method: "PATCH",
        body: JSON.stringify({ fullName }),
      });
      setMessage("اطلاعات پروفایل با موفقیت به‌روزرسانی شد");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در به‌روزرسانی");
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await apiFetch("/api/admin/profile/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setMessage("رمز عبور با موفقیت تغییر کرد");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در تغییر رمز عبور");
    }
  }

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-bold text-navy-800">پروفایل من</h1>

      {message && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>}
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleProfileSubmit} className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-navy-800">ویرایش اطلاعات</h2>
        <div>
          <label className="mb-1 block text-sm text-navy-600">نام کامل</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
            placeholder="نام و نام خانوادگی"
          />
        </div>
        <button className="rounded-lg bg-navy-700 px-4 py-2 text-sm text-white hover:bg-navy-800">
          ذخیره تغییرات
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-navy-800">تغییر رمز عبور</h2>
        <div>
          <label className="mb-1 block text-sm text-navy-600">رمز عبور فعلی</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-navy-600">رمز عبور جدید</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
          />
        </div>
        <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600">
          تغییر رمز عبور
        </button>
      </form>
    </div>
  );
}
