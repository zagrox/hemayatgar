import { notFound } from "next/navigation";
import Link from "next/link";
import { ConsultationRequestForm } from "@/components/ConsultationRequestForm";
import { PageSectionRenderer, getPageSections } from "@/components/site/PageSectionRenderer";
import { InsuranceCategoryIcon } from "@/components/site/InsuranceCategoryIcon";
import { CoverageIcon } from "@/components/site/CoverageIcon";
import { Breadcrumb } from "@/components/site/Breadcrumb";

interface Subsection {
  id: string;
  slug: string;
  title: string;
  introduction: string;
  coverages: string;
  imageUrl: string | null;
}

interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

interface CategoryDetail {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  heroImageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  subsections: Subsection[];
  faqs: FaqEntry[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function getCategory(slug: string): Promise<CategoryDetail | null> {
  const res = await fetch(`${API_URL}/api/insurance-categories/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  return {
    title: category.seoTitle ?? category.title,
    description: category.seoDescription ?? category.shortDescription ?? undefined,
  };
}

function splitCoverageItems(text: string): string[] {
  return text
    .split(/\n|،|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const ADVANTAGES = [
  { title: "مشاوره تخصصی رایگان", desc: "تحلیل دقیق ریسک و انتخاب بهترین پوشش" },
  { title: "پوشش کامل و متنوع", desc: "ارائه بهترین طرح‌های متناسب با نیاز شما" },
  { title: "صدور سریع بیمه‌نامه", desc: "صدور آنلاین در کمترین زمان ممکن" },
  { title: "قیمت مناسب", desc: "بهترین قیمت بازار با شرایط پرداخت منعطف" },
  { title: "پرداخت سریع خسارت", desc: "پرداخت خسارت در سریع‌ترین زمان ممکن" },
  { title: "پشتیبانی ۲۴ ساعته", desc: "پشتیبانی و راهنمایی در تمام روزهای هفته" },
];

export default async function InsuranceCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  const dynamicSections = await getPageSections(`insurance-${slug}`);

  const allCoverageItems = Array.from(
    new Set(category.subsections.flatMap((sub) => splitCoverageItems(sub.coverages))),
  ).slice(0, 24);

  return (
    <div>
      {/* هیرو */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <Breadcrumb items={[{ label: "صفحه اصلی", href: "/" }, { label: "بیمه‌ها", href: "/insurance" }, { label: category.title }]} />
      </div>

      <section className="relative h-40 overflow-hidden bg-gradient-to-l from-navy-50 to-white sm:h-64">
        {category.heroImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={category.heroImageUrl} alt={category.title} className="absolute inset-0 h-full w-full object-contain" />
        )}
        {!category.heroImageUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <InsuranceCategoryIcon slug={category.slug} className="h-16 w-16 text-navy-400 sm:h-24 sm:w-24" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 className="text-center text-xl font-extrabold text-navy-800 sm:text-3xl">{category.title}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4">
        {category.shortDescription && (
          <p className="mt-4 max-w-2xl text-xs text-navy-500 sm:mt-6 sm:text-base">{category.shortDescription}</p>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4">
        {/* گرید زیررشته‌ها */}
        {category.subsections.length > 0 && (
          <section className="py-12">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-navy-800">انواع {category.title}</h2>
              <p className="mt-2 text-sm text-navy-400">متناسب با نیاز شما، بهترین پوشش را انتخاب کنید</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.subsections.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/insurance/${category.slug}/${sub.slug}`}
                  className="overflow-hidden rounded-card bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className={`flex h-36 items-center justify-center ${sub.imageUrl ? "" : "bg-navy-50"}`}>
                    {sub.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={sub.imageUrl} alt={sub.title} className="h-full w-full object-contain" />
                    ) : (
                      <InsuranceCategoryIcon slug={category.slug} className="h-12 w-12 text-navy-300" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="mb-1 font-semibold text-navy-800">{sub.title}</h3>
                    <p className="mb-3 line-clamp-2 text-sm text-navy-400">{sub.introduction}</p>
                    <span className="text-xs text-orange-600">مشاهده جزئیات ←</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* گرید آیکون پوشش‌ها */}
        {allCoverageItems.length > 0 && (
          <section className="border-t border-navy-100 py-12">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-navy-800">پوشش‌های {category.title}</h2>
              <p className="mt-2 text-sm text-navy-400">حمایت کامل در برابر طیف گسترده‌ای از ریسک‌ها</p>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {allCoverageItems.map((item) => (
                <div key={item} className="rounded-card bg-white p-4 text-center shadow-sm">
                  <CoverageIcon label={item} className="mx-auto mb-2 h-7 w-7 text-navy-700" />
                  <p className="text-xs text-navy-600">{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* مزایا */}
        <section className="border-t border-navy-100 py-12">
          <h2 className="mb-8 text-center text-2xl font-bold text-navy-800">
            مزایای انتخاب {category.title} با حمایتگر
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {ADVANTAGES.map((adv) => (
              <div key={adv.title} className="rounded-card bg-white p-4 text-center shadow-sm">
                <p className="text-xs font-semibold text-navy-800">{adv.title}</p>
                <p className="mt-1 text-[11px] text-navy-400">{adv.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {category.faqs.length > 0 && (
          <section className="border-t border-navy-100 py-12">
            <h2 className="mb-6 text-lg font-bold text-navy-800">سوالات متداول</h2>
            <div className="space-y-3">
              {category.faqs.map((faq) => (
                <details key={faq.id} className="rounded-card bg-white p-4 shadow-sm">
                  <summary className="cursor-pointer font-medium text-navy-800">{faq.question}</summary>
                  <p className="mt-2 text-sm leading-7 text-navy-500">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>

      <PageSectionRenderer sections={dynamicSections} />

      <section id="consultation-form" className="mx-auto max-w-lg px-4 pb-16 pt-4">
        <ConsultationRequestForm defaultInsuranceCategoryId={category.id} />
      </section>
    </div>
  );
}
