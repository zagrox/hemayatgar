import Link from "next/link";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { InsuranceCategoryIcon } from "@/components/site/InsuranceCategoryIcon";

interface InsuranceCategoryCard {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  icon: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function getCategories(): Promise<InsuranceCategoryCard[]> {
  const res = await fetch(`${API_URL}/api/insurance-categories`, { next: { revalidate: 120 } });
  if (!res.ok) return [];
  return res.json();
}

export const metadata = { title: "خدمات و رشته‌های بیمه" };

export default async function InsuranceListPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumb items={[{ label: "صفحه اصلی", href: "/" }, { label: "بیمه‌ها" }]} />

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-navy-800 md:text-3xl">تمامی رشته‌های بیمه ایران</h1>
        <p className="mt-2 text-sm text-navy-400">راهکارهای بیمه‌ای متنوع، متناسب با نیاز شما</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/insurance/${category.slug}`}
            className="rounded-card bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            {category.icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={category.icon} alt={category.title} className="mb-3 h-20 w-20 object-contain" />
            ) : (
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-navy-50">
                <InsuranceCategoryIcon slug={category.slug} className="h-8 w-8 text-navy-700" />
              </div>
            )}
            <h2 className="mb-1 font-semibold text-navy-800">{category.title}</h2>
            <p className="mb-3 text-sm text-navy-400">{category.shortDescription ?? "مشاهده جزئیات و پوشش‌ها"}</p>
            <span className="text-xs text-orange-600">مشاهده جزئیات ←</span>
          </Link>
        ))}
        {categories.length === 0 && (
          <p className="col-span-full text-center text-navy-400">رشته‌های بیمه به‌زودی اضافه می‌شوند.</p>
        )}
      </div>
    </div>
  );
}
