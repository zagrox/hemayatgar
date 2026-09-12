import { notFound } from "next/navigation";
import { ConsultationRequestForm } from "@/components/ConsultationRequestForm";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { TrustBadgeRow } from "@/components/site/TrustBadgeRow";
import { CoverageIcon } from "@/components/site/CoverageIcon";

interface Subsection {
  id: string;
  slug: string;
  title: string;
  introduction: string;
  coverages: string;
  exclusions: string;
  benefits: string;
  imageUrl: string | null;
  faqs: { id: string; question: string; answer: string }[];
}

interface CategoryDetail {
  id: string;
  slug: string;
  title: string;
  subsections: Subsection[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function getCategoryWithSubsections(categorySlug: string): Promise<CategoryDetail | null> {
  const res = await fetch(`${API_URL}/api/insurance-categories/${categorySlug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

function splitCoverageItems(text: string): string[] {
  return text
    .split(/\n|،|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; subsectionSlug: string }>;
}) {
  const { categorySlug, subsectionSlug } = await params;
  const category = await getCategoryWithSubsections(categorySlug);
  const subsection = category?.subsections.find((s) => s.slug === subsectionSlug);
  if (!subsection) return {};
  return {
    title: `${subsection.title} | ${category?.title}`,
    description: subsection.introduction.slice(0, 150),
  };
}

// طبق درخواست، هر زیررشته‌ای که در دیتابیس وجود داشته باشد، همیشه صفحه اختصاصی خودش را دارد —
// نیازی به فعال‌سازی دستی نیست.
export default async function StandaloneSubsectionPage({
  params,
}: {
  params: Promise<{ categorySlug: string; subsectionSlug: string }>;
}) {
  const { categorySlug, subsectionSlug } = await params;
  const category = await getCategoryWithSubsections(categorySlug);
  const subsection = category?.subsections.find((s) => s.slug === subsectionSlug);

  if (!category || !subsection) {
    notFound();
  }

  const coverageItems = splitCoverageItems(subsection.coverages);
  const exclusionItems = splitCoverageItems(subsection.exclusions);
  const benefitItems = splitCoverageItems(subsection.benefits);

  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <Breadcrumb
          items={[
            { label: "صفحه اصلی", href: "/" },
            { label: "بیمه‌ها", href: "/insurance" },
            { label: category.title, href: `/insurance/${category.slug}` },
            { label: subsection.title },
          ]}
        />
      </div>

      <section className="relative h-40 overflow-hidden bg-gradient-to-l from-navy-50 to-white sm:h-56">
        {subsection.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={subsection.imageUrl} alt={subsection.title} className="absolute inset-0 h-full w-full object-contain" />
        )}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 className="text-center text-xl font-extrabold text-navy-900 sm:text-3xl">{subsection.title}</h1>
        </div>
      </section>

      <section className="bg-white py-6">
        <div className="mx-auto max-w-4xl px-4">
          <p className="mb-6 text-sm leading-7 text-navy-500">{subsection.introduction}</p>
          <TrustBadgeRow />
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10">
        {coverageItems.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-bold text-navy-800">پوشش‌ها</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {coverageItems.map((item) => (
                <div key={item} className="rounded-card bg-white p-4 text-center shadow-sm">
                  <CoverageIcon label={item} className="mx-auto mb-2 h-6 w-6 text-navy-700" />
                  <p className="text-xs text-navy-600">{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {exclusionItems.length > 0 && (
          <section className="mb-10 rounded-card bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-navy-800">موارد استثناء</h2>
            <ul className="space-y-2 text-sm text-navy-500">
              {exclusionItems.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-red-400">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {benefitItems.length > 0 && (
          <section className="mb-10 rounded-card bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-navy-800">مزایا</h2>
            <ul className="space-y-2 text-sm text-navy-500">
              {benefitItems.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {subsection.faqs.length > 0 && (
          <section className="rounded-card bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-navy-800">سوالات متداول</h2>
            <div className="space-y-3">
              {subsection.faqs.map((faq) => (
                <details key={faq.id} className="border-b border-navy-50 pb-3">
                  <summary className="cursor-pointer font-medium text-navy-700">{faq.question}</summary>
                  <p className="mt-2 text-sm text-navy-500">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>

      <section id="consultation-form" className="mx-auto max-w-lg px-4 pb-16">
        <ConsultationRequestForm defaultInsuranceCategoryId={category.id} />
      </section>
    </div>
  );
}
