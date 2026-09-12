import Link from "next/link";
import { ConsultationRequestForm } from "@/components/ConsultationRequestForm";
import { PageSectionRenderer, getPageSections } from "@/components/site/PageSectionRenderer";
import { InsuranceCategoryIcon } from "@/components/site/InsuranceCategoryIcon";

interface InsuranceCategoryCard {
  id: string;
  slug: string;
  title: string;
  icon: string | null;
  shortDescription: string | null;
}

interface ArticleCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function getInsuranceCategories(): Promise<InsuranceCategoryCard[]> {
  try {
    const res = await fetch(`${API_URL}/api/insurance-categories`, { next: { revalidate: 120 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getLatestArticles(): Promise<ArticleCard[]> {
  try {
    const res = await fetch(`${API_URL}/api/articles`, { next: { revalidate: 120 } });
    if (!res.ok) return [];
    const all: ArticleCard[] = await res.json();
    return all.slice(0, 3);
  } catch {
    return [];
  }
}

interface HeroSettings {
  heroImageUrl: string | null;
  heroSecondaryImageUrl: string | null;
}

async function getHeroSettings(): Promise<HeroSettings> {
  try {
    const res = await fetch(`${API_URL}/api/site-settings`, { next: { revalidate: 120 } });
    if (!res.ok) return { heroImageUrl: null, heroSecondaryImageUrl: null };
    return res.json();
  } catch {
    return { heroImageUrl: null, heroSecondaryImageUrl: null };
  }
}

const WHY_US_ITEMS = [
  { title: "پرداخت خسارت", desc: "بیش از ۲۰ سال تجربه در صنعت بیمه" },
  { title: "مشاوره تخصصی", desc: "ارائه بهترین راهکار متناسب با نیاز شما" },
  { title: "تفاوت سریع", desc: "پرداخت سریع و بدون دردسر" },
  { title: "پشتیبانی و همراهی", desc: "همراه شما در تمام مراحل" },
];

export default async function HomePage() {
  const [categories, articles, dynamicSections, heroSettings] = await Promise.all([
    getInsuranceCategories(),
    getLatestArticles(),
    getPageSections("home"),
    getHeroSettings(),
  ]);

  return (
    <div>
      {/* هیرو — عکس تمام‌عرض با شعار روی فضای خالی خودِ عکس (بدون سایه تیره، چون طرح عکس از قبل فضای روشن برای متن داره) */}
      <section className="relative h-56 overflow-hidden bg-gradient-to-l from-navy-50 to-white sm:h-80 md:h-[420px]">
        {heroSettings.heroImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroSettings.heroImageUrl}
            alt="حمایتگر - نمایندگی بیمه ایران"
            className="absolute inset-0 h-full w-full object-contain"
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center sm:gap-3">
          <p className="text-xs font-medium text-navy-600 sm:text-base">آرامش امروز، امنیت فردا</p>
          <h1 className="text-2xl font-extrabold text-navy-900 sm:text-4xl md:text-5xl">
            حمایت مطمئن شما
          </h1>
          <p className="text-[11px] text-navy-500 sm:text-sm">نمایندگی رسمی بیمه ایران</p>
        </div>
      </section>

      {/* گرید رشته‌های بیمه */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-navy-800">بیمه‌های ما</h2>
          <p className="mt-2 text-sm text-navy-400">پوشش کامل برای تمام نیازهای شما</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/insurance/${category.slug}`}
              className="rounded-card bg-white p-4 text-center shadow-sm transition hover:shadow-md"
            >
              {category.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={category.icon}
                  alt={category.title}
                  className="mx-auto mb-3 h-20 w-20 object-contain sm:h-24 sm:w-24"
                />
              ) : (
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-navy-50 sm:h-20 sm:w-20">
                  <InsuranceCategoryIcon slug={category.slug} className="h-8 w-8 text-navy-700 sm:h-10 sm:w-10" />
                </div>
              )}
              <p className="text-sm font-semibold text-navy-800">{category.title}</p>
              {category.shortDescription && (
                <p className="mt-1 text-xs text-navy-400">{category.shortDescription}</p>
              )}
              <span className="mt-2 inline-block text-xs text-orange-600">بیشتر بدانید ←</span>
            </Link>
          ))}
          {categories.length === 0 && (
            <p className="col-span-full text-center text-navy-400">
              رشته‌های بیمه به‌زودی از پنل مدیریت اضافه می‌شوند.
            </p>
          )}
        </div>
      </section>

      {/* چرا حمایتگر */}
      <section className="bg-navy-50 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2">
          {heroSettings.heroSecondaryImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroSettings.heroSecondaryImageUrl}
              alt="نماینده بیمه حمایتگر"
              className="h-64 w-full rounded-card object-contain"
            />
          ) : (
            <div className="h-64 rounded-card bg-navy-100" />
          )}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-navy-800">
              چرا شرکت خدمات بیمه‌ای حمایتگر (کد ۹۹۶۸)؟
            </h2>
            <p className="mb-6 text-sm text-navy-500">
              ما با تکیه بر خدمات حرفه‌ای، تجربه و تعهد، آرامش و امنیت شما را تضمین می‌کنیم.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {WHY_US_ITEMS.map((item) => (
                <div key={item.title} className="rounded-card bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-navy-800">{item.title}</p>
                  <p className="mt-1 text-xs text-navy-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* مقالات */}
      {articles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-navy-800">مقالات و اخبار بیمه</h2>
              <p className="mt-1 text-sm text-navy-400">
                با جدیدترین مطالب و اخبار صنعت بیمه همراه باشید
              </p>
            </div>
            <Link href="/blog" className="text-sm text-orange-600">
              همه مقالات ←
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="overflow-hidden rounded-card bg-white shadow-sm transition hover:shadow-md"
              >
                {article.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.coverImageUrl} alt={article.title} className="h-40 w-full object-contain" />
                ) : (
                  <div className="h-40 bg-navy-100" />
                )}
                <div className="p-4">
                  <p className="font-semibold text-navy-800">{article.title}</p>
                  {article.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-navy-400">{article.excerpt}</p>
                  )}
                  {article.publishedAt && (
                    <p className="mt-3 text-xs text-navy-400">
                      تاریخ: {new Intl.DateTimeFormat("fa-IR").format(new Date(article.publishedAt))}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* نوار CTA */}
      <section className="bg-navy-800 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-right">
          <div>
            <p className="text-lg font-bold text-white">برای دریافت مشاوره رایگان</p>
            <p className="text-sm text-navy-200">با ما تماس بگیرید یا فرم درخواست مشاوره را تکمیل کنید</p>
          </div>
          <a
            href="#consultation-form"
            className="rounded-btn bg-white px-6 py-3 text-sm font-medium text-navy-800 hover:bg-navy-50"
          >
            درخواست مشاوره
          </a>
        </div>
      </section>

      {/* بخش‌های پویا — با دستیار هوش مصنوعی یا پنل مدیریت اضافه/حذف می‌شوند */}
      <PageSectionRenderer sections={dynamicSections} />

      {/* فرم درخواست مشاوره */}
      <section id="consultation-form" className="mx-auto max-w-lg px-4 py-16">
        <ConsultationRequestForm />
      </section>
    </div>
  );
}
