"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const NAV_LINKS = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/#services", label: "خدمات" },
  { href: "/insurance", label: "بیمه‌ها" },
  { href: "/blog", label: "مقالات" },
  { href: "/about-us", label: "درباره ما" },
  { href: "/contact-us", label: "تماس با ما" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/site-settings`)
      .then((res) => res.json())
      .then((data) => setLogoUrl(data.logoUrl ?? null))
      .catch(() => setLogoUrl(null));
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="حمایتگر" className="h-10 w-10 shrink-0 rounded-full object-contain md:h-11 md:w-11" />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-700 text-sm font-bold text-white md:h-11 md:w-11">
              ح
            </div>
          )}
          <div className="text-right">
            <p className="text-xs font-bold text-navy-800 md:text-sm">
              شرکت خدمات بیمه‌ای حمایتگر
            </p>
            <p className="hidden text-xs text-navy-400 md:block">نمایندگی بیمه ایران کد ۹۹۶۸</p>
          </div>
        </Link>

        {/* منوی دسکتاپ */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-navy-600 transition hover:text-navy-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="جستجو در سایت"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-navy-200 text-navy-600 transition hover:bg-navy-50 md:flex"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          <Link
            href="/request"
            className="hidden rounded-full bg-navy-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-navy-900 md:inline-block"
          >
            استعلام و خرید آنلاین
          </Link>

          {/* دکمه همبرگری موبایل */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="باز کردن منو"
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-navy-200 text-navy-700 md:hidden"
          >
            {isMenuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* منوی موبایل (کشویی) */}
      {isMenuOpen && (
        <nav className="border-t border-navy-100 bg-white px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-navy-700 hover:bg-navy-50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/search"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-navy-700 hover:bg-navy-50"
              >
                جستجو
              </Link>
            </li>
            <li className="mt-2">
              <Link
                href="/request"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-full bg-navy-800 px-4 py-2.5 text-center text-sm font-medium text-white"
              >
                استعلام و خرید آنلاین
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
