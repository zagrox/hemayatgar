import { getStaticPage } from "@/lib/content";
import { PageSectionRenderer, getPageSections } from "@/components/site/PageSectionRenderer";
import { Breadcrumb } from "@/components/site/Breadcrumb";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface AboutSettings {
  agencyCode: string;
  statSatisfiedCustomers: string | null;
  statPoliciesIssued: string | null;
  statYearsExperience: string | null;
  heroSecondaryImageUrl: string | null; // از عکس نماینده در تنظیمات سایت استفاده می‌شود
}

async function getSettings(): Promise<AboutSettings | null> {
  try {
    const res = await fetch(`${API_URL}/api/site-settings`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const VALUES = [
  { title: "اعتماد", desc: "اعتماد شما بزرگ‌ترین سرمایه ماست و همواره در حفظ آن کوشا هستیم." },
  { title: "مشتری‌مداری", desc: "نیازهای شما را می‌شنویم و بهترین راهکارها را پیشنهاد می‌دهیم." },
  { title: "تعهد", desc: "متعهد به ارائه خدمات با کیفیت، دقیق و در کمترین زمان ممکن." },
  { title: "تخصص", desc: "تیم ما با دانش و تجربه همراه شما در انتخاب بهترین پوشش‌هاست." },
];

export const metadata = { title: "درباره ما" };

export default async function AboutUsPage() {
  const [page, sections, settings] = await Promise.all([
    getStaticPage("about-us"),
    getPageSections("about-us"),
    getSettings(),
  ]);

  const STATS = [
    { value: settings?.statSatisfiedCustomers ?? "+5,000", label: "مشتری راضی" },
    { value: settings?.statPoliciesIssued ?? "+10,000", label: "بیمه‌نامه صادر شده" },
    { value: settings?.statYearsExperience ?? "+15", label: "سال سابقه فعالیت" },
    { value: settings?.agencyCode ?? "9968", label: "نماینده رسمی بیمه ایران" },
  ];

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Breadcrumb items={[{ label: "صفحه اصلی", href: "/" }, { label: "درباره ما" }]} />

        {/* هیرو: عکس نماینده + معرفی کوتاه */}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="h-72 overflow-hidden rounded-card bg-navy-50 md:h-96">
            {settings?.heroSecondaryImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.heroSecondaryImageUrl}
                alt="نماینده حمایتگر"
                className="h-full w-full object-contain"
              />
            )}
          </div>
          <div>
            <span className="mb-3 inline-block rounded-full bg-navy-50 px-3 py-1 text-xs text-navy-600">
              درباره ما
            </span>
            <h1 className="mb-4 text-2xl font-bold text-navy-900 md:text-3xl">
              {page?.title ?? "ما اینجا هستیم تا آرامش، آینده شما را بیمه کنیم"}
            </h1>
            <p className="mb-6 text-sm leading-8 text-navy-500">
              شرکت خدمات بیمه‌ای حمایتگر، نمایندگی رسمی بیمه ایران (کد {settings?.agencyCode ?? "9968"}
              ) با تکیه بر تجربه، تخصص و تعهد، همراه مطمئن شما در مسیر بیمه و مدیریت ریسک‌های زندگی و
              کسب‌وکارتان است.
            </p>
            <a
              href="/contact-us"
              className="inline-block rounded-btn bg-navy-800 px-6 py-3 text-sm font-medium text-white hover:bg-navy-900"
            >
              درخواست مشاوره و صدور بیمه‌نامه
            </a>
          </div>
        </div>

        {/* متن کامل درباره شرکت (از پنل/دستیار قابل ویرایش) */}
        {page?.content && (
          <div
            className="prose prose-navy mx-auto mt-16 max-w-3xl text-sm leading-8 text-navy-700"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}

        {/* آمار */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-xl font-bold text-navy-800">حمایتگر در یک نگاه</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-card bg-white p-5 text-center shadow-sm">
                <p className="text-2xl font-extrabold text-navy-800">{stat.value}</p>
                <p className="mt-1 text-xs text-navy-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ماموریت و ارزش‌ها */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-xl font-bold text-navy-800">ماموریت و ارزش‌های ما</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-card bg-white p-5 text-center shadow-sm">
                <p className="mb-1 font-semibold text-navy-800">{value.title}</p>
                <p className="text-xs text-navy-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA پایانی */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 rounded-card bg-navy-50 p-6 text-center md:flex-row md:text-right">
          <div>
            <p className="text-lg font-bold text-navy-800">با حمایتگر، با خیال راحت آینده را بسازید.</p>
            <p className="mt-1 text-sm text-navy-500">همین حالا با ما تماس بگیرید و از مشاوره رایگان بهره‌مند شوید.</p>
          </div>
          <a
            href="/contact-us"
            className="rounded-btn bg-navy-800 px-6 py-3 text-sm font-medium text-white hover:bg-navy-900"
          >
            تماس با ما
          </a>
        </div>
      </div>

      <PageSectionRenderer sections={sections} />
    </>
  );
}
