import Link from "next/link";

interface SiteSettingsPublic {
  siteName: string;
  siteTagline: string | null;
  agencyManager: string;
  agencyCode: string;
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
}

async function getSettings(): Promise<SiteSettingsPublic | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  try {
    const res = await fetch(`${apiUrl}/api/site-settings`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const QUICK_LINKS = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/about-us", label: "درباره ما" },
  { href: "/insurance", label: "خدمات" },
  { href: "/blog", label: "مقالات" },
  { href: "/request", label: "درخواست مشاوره" },
  { href: "/rates", label: "استعلام نرخ" },
  { href: "/customer-club", label: "باشگاه مشتریان" },
  { href: "/faq", label: "سوالات متداول" },
  { href: "/cooperation", label: "همکاری با ما" },
  { href: "/contact-us", label: "تماس با ما" },
];

export async function SiteFooter() {
  const settings = await getSettings();

  return (
    <footer className="mt-16 bg-navy-900 py-10 text-navy-200">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-4">
        <div>
          <p className="mb-2 text-lg font-bold text-white">
            {settings?.siteName ?? "حمایتگر"}
          </p>
          <p className="text-sm">
            {settings?.siteTagline ?? "نمایندگی رسمی بیمه ایران"} — کد نمایندگی{" "}
            {settings?.agencyCode ?? "9968"}
          </p>
          <div className="mt-4 flex gap-3 text-sm">
            {settings?.instagramUrl && <a href={settings.instagramUrl}>اینستاگرام</a>}
            {settings?.telegramUrl && <a href={settings.telegramUrl}>تلگرام</a>}
            {settings?.whatsappUrl && <a href={settings.whatsappUrl}>واتساپ</a>}
            {settings?.baleUrl && <a href={settings.baleUrl}>بله</a>}
            {settings?.rubikaUrl && <a href={settings.rubikaUrl}>روبیکا</a>}
          </div>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">دسترسی سریع</p>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">تماس با ما</p>
          <ul className="space-y-2 text-sm">
            {settings?.phone && <li dir="ltr">{settings.phone}</li>}
            {settings?.mobile && <li dir="ltr">{settings.mobile}</li>}
            {settings?.email && <li dir="ltr">{settings.email}</li>}
          </ul>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">آدرس و ساعات کاری</p>
          <p className="text-sm">{settings?.address ?? "-"}</p>
          <p className="mt-2 text-sm">{settings?.workingHours ?? "-"}</p>
        </div>
      </div>

      <p className="mt-8 border-t border-navy-800 pt-4 text-center text-xs text-navy-400">
        © کلیه حقوق محفوظ است — شرکت خدمات بیمه‌ای {settings?.agencyManager ?? "حمایتگر"}
        {" · "}
        <Link href="/privacy-policy" className="hover:text-white">حریم خصوصی</Link>
        {" · "}
        <Link href="/terms" className="hover:text-white">قوانین و مقررات</Link>
      </p>
    </footer>
  );
}
