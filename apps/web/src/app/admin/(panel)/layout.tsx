"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "داشبورد" },
  { href: "/admin/requests", label: "درخواست‌ها" },
  { href: "/admin/customers", label: "مشتریان" },
  { href: "/admin/content", label: "مدیریت محتوا" },
  { href: "/admin/insurance", label: "رشته‌های بیمه" },
  { href: "/admin/ai-assistant", label: "دستیار هوش مصنوعی" },
  { href: "/admin/page-builder", label: "بخش‌های پویای صفحات" },
  { href: "/admin/users", label: "کاربران" },
  { href: "/admin/settings", label: "تنظیمات سایت" },
  { href: "/admin/profile", label: "پروفایل من" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="border-b border-navy-700 px-6 py-5">
        <p className="text-lg font-bold">حمایتگر</p>
        <p className="text-xs text-navy-300">نمایندگی بیمه ایران - کد ۹۹۶۸</p>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg px-3 py-2 text-sm text-navy-100 transition hover:bg-navy-700"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );

  return (
    <div className="flex min-h-screen bg-navy-50">
      {/* سایدبار دسکتاپ (همیشه نمایان) */}
      <aside className="hidden w-64 shrink-0 bg-navy-800 text-white md:block">{sidebarContent}</aside>

      {/* نوار بالای موبایل با دکمه باز کردن منو */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-navy-100 bg-white px-4 py-3 md:hidden">
          <p className="text-sm font-bold text-navy-800">پنل مدیریت حمایتگر</p>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="باز کردن منو"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 text-navy-700"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>

        <main className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</main>
      </div>

      {/* منوی کشویی موبایل + پس‌زمینه تیره */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-64 bg-navy-800 text-white shadow-xl">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="بستن منو"
              className="absolute left-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-navy-200 hover:bg-navy-700"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </div>
  );
}
