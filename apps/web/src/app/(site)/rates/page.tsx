import Link from "next/link";
import { getStaticPage } from "@/lib/content";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { InsuranceCategoryIcon } from "@/components/site/InsuranceCategoryIcon";

interface InsuranceCategoryCard {
  id: string;
  slug: string;
  title: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function getCategories(): Promise<InsuranceCategoryCard[]> {
  try {
    const res = await fetch(`${API_URL}/api/insurance-categories`, { next: { revalidate: 120 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export const metadata = { title: "استعلام نرخ بیمه" };

export default async function RatesPage() {
  const [page, categories] = await Promise.all([getStaticPage("rates"), getCategories()]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumb items={[{ label: "صفحه اصلی", href: "/" }, { label: "استعلام نرخ" }]} />

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-navy-800 md:text-3xl">
          {page?.title ?? "استعلام نرخ بیمه"}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-navy-500">
          {page?.content ? (
            <span dangerouslySetInnerHTML={{ __html: page.content }} />
          ) : (
            "برای دریافت نرخ دقیق هر رشته بیمه، روی آن کلیک کنید یا با کارشناسان ما در ارتباط باشید."
          )}
        </p>
      </div>

      <div className="overflow-x-auto rounded-card bg-white shadow-sm">
        <table className="w-full text-right text-sm">
          <thead className="bg-navy-50 text-navy-600">
            <tr>
              <th className="px-4 py-3">رشته بیمه</th>
              <th className="px-4 py-3">وضعیت نرخ‌گذاری</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-navy-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <InsuranceCategoryIcon slug={category.slug} className="h-5 w-5 text-navy-600" />
                    {category.title}
                  </div>
                </td>
                <td className="px-4 py-3 text-navy-400">استعلام از طریق کارشناسان</td>
                <td className="px-4 py-3 text-left">
                  <Link href="/request" className="text-xs text-orange-600 hover:underline">
                    درخواست استعلام ←
                  </Link>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-navy-400">
                  رشته‌های بیمه به‌زودی اضافه می‌شوند
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-center text-xs text-navy-400">
        نرخ‌های دقیق و آنی به‌زودی از طریق اتصال مستقیم به سامانه بیمه ایران در همین صفحه فعال
        می‌شود.
      </p>
    </div>
  );
}
