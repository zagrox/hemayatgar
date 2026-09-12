import { serverApiFetch } from "@/lib/server-api";

interface SectionRow {
  id: string;
  pageSlug: string;
  type: string;
  order: number;
  isActive: boolean;
}

const PAGES = [
  { slug: "home", label: "صفحه اصلی" },
  { slug: "about-us", label: "درباره ما" },
  { slug: "contact-us", label: "تماس با ما" },
  { slug: "cooperation", label: "همکاری با ما" },
];

const TYPE_LABELS: Record<string, string> = {
  HERO: "هیرو",
  TEXT_IMAGE: "متن + تصویر",
  FEATURE_GRID: "گرید ویژگی‌ها",
  TESTIMONIALS: "نظرات مشتریان",
  CTA_BANNER: "نوار دعوت به اقدام",
  IMAGE_GALLERY: "گالری تصاویر",
  CUSTOM_HTML: "محتوای سفارشی",
};

export default async function PageBuilderOverview() {
  const sectionsPerPage = await Promise.all(
    PAGES.map((p) => serverApiFetch<SectionRow[]>(`/api/admin/page-sections/${p.slug}`)),
  );

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-navy-800">بخش‌های پویای صفحات (Page Builder)</h1>
      <p className="mb-6 text-sm text-navy-400">
        این بخش‌ها معمولاً توسط دستیار هوش مصنوعی (`/admin/ai-assistant`) اضافه می‌شوند؛ اینجا
        فقط برای مشاهده و بررسی است.
      </p>

      <div className="space-y-6">
        {PAGES.map((p, idx) => (
          <div key={p.slug} className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-navy-800">{p.label}</h2>
            {sectionsPerPage[idx].length === 0 ? (
              <p className="text-xs text-navy-400">هنوز بخش پویایی برای این صفحه اضافه نشده.</p>
            ) : (
              <div className="space-y-2">
                {sectionsPerPage[idx].map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between rounded-lg bg-navy-50 px-3 py-2 text-sm"
                  >
                    <span>{TYPE_LABELS[section.type] ?? section.type}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        section.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {section.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
