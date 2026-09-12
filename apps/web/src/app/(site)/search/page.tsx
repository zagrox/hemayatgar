import Link from "next/link";
import { Breadcrumb } from "@/components/site/Breadcrumb";

interface SearchResults {
  pages: { slug: string; title: string }[];
  articles: { slug: string; title: string; excerpt: string | null }[];
  insuranceCategories: { slug: string; title: string; shortDescription: string | null }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function search(q: string): Promise<SearchResults> {
  const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(q)}`, { cache: "no-store" });
  if (!res.ok) return { pages: [], articles: [], insuranceCategories: [] };
  return res.json();
}

export const metadata = { title: "جستجو در سایت" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const results = q ? await search(q) : { pages: [], articles: [], insuranceCategories: [] };
  const hasResults =
    results.pages.length + results.articles.length + results.insuranceCategories.length > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumb items={[{ label: "صفحه اصلی", href: "/" }, { label: "جستجو" }]} />
      <h1 className="mb-6 text-2xl font-bold text-navy-800">جستجو در سایت</h1>

      <form action="/search" method="get" className="mb-8">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="جستجو در رشته‌های بیمه، مقالات و صفحات..."
          className="w-full rounded-full border border-navy-200 px-5 py-3 text-sm focus:border-orange-500 focus:outline-none"
        />
      </form>

      {!q && <p className="text-navy-400">عبارت مورد نظر خود را جستجو کنید.</p>}

      {q && !hasResults && (
        <p className="text-navy-400">نتیجه‌ای برای «{q}» یافت نشد.</p>
      )}

      {results.insuranceCategories.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-navy-600">رشته‌های بیمه</h2>
          <div className="space-y-2">
            {results.insuranceCategories.map((item) => (
              <Link
                key={item.slug}
                href={`/insurance/${item.slug}`}
                className="block rounded-card bg-white p-4 shadow-sm hover:shadow-md"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.articles.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-navy-600">مقالات</h2>
          <div className="space-y-2">
            {results.articles.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="block rounded-card bg-white p-4 shadow-sm hover:shadow-md"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.pages.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-navy-600">صفحات</h2>
          <div className="space-y-2">
            {results.pages.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className="block rounded-card bg-white p-4 shadow-sm hover:shadow-md"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
