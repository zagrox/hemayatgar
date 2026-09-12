import Link from "next/link";
import { Breadcrumb } from "@/components/site/Breadcrumb";

interface ArticleCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
  category: { title: string; slug: string } | null;
}

interface ArticleCategory {
  id: string;
  slug: string;
  title: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const PAGE_SIZE = 6;

async function getArticles(categorySlug?: string): Promise<ArticleCard[]> {
  const url = categorySlug
    ? `${API_URL}/api/articles?category=${categorySlug}`
    : `${API_URL}/api/articles`;
  const res = await fetch(url, { next: { revalidate: 120 } });
  if (!res.ok) return [];
  return res.json();
}

async function getCategories(): Promise<ArticleCategory[]> {
  const res = await fetch(`${API_URL}/api/articles/categories`, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  return res.json();
}

export const metadata = { title: "وبلاگ" };

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page } = await searchParams;
  const [allArticles, categories] = await Promise.all([getArticles(category), getCategories()]);

  const currentPage = Math.max(1, Number(page) || 1);
  const featured = currentPage === 1 ? allArticles[0] : undefined;
  const rest = currentPage === 1 ? allArticles.slice(1) : allArticles;
  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const pageItems = rest.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function categoryHref(slug?: string) {
    return slug ? `/blog?category=${slug}` : "/blog";
  }
  function pageHref(pageNum: number) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    params.set("page", String(pageNum));
    return `/blog?${params.toString()}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumb items={[{ label: "صفحه اصلی", href: "/" }, { label: "مقالات" }]} />

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-navy-800 md:text-3xl">اخبار و مقالات</h1>
        <p className="mt-2 text-sm text-navy-400">
          جدیدترین اخبار و مقالات آموزشی و تحلیلی حوزه بیمه را دنبال کنید
        </p>
      </div>

      {/* تب‌های دسته‌بندی */}
      <div className="mb-8 flex flex-wrap justify-center gap-2 overflow-x-auto">
        <Link
          href={categoryHref()}
          className={`rounded-full px-4 py-2 text-xs whitespace-nowrap ${
            !category ? "bg-navy-800 text-white" : "bg-white text-navy-600 hover:bg-navy-50"
          }`}
        >
          همه مقالات
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={categoryHref(cat.slug)}
            className={`rounded-full px-4 py-2 text-xs whitespace-nowrap ${
              category === cat.slug ? "bg-navy-800 text-white" : "bg-white text-navy-600 hover:bg-navy-50"
            }`}
          >
            {cat.title}
          </Link>
        ))}
      </div>

      {/* مقاله ویژه */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="mb-10 grid grid-cols-1 gap-0 overflow-hidden rounded-card bg-white shadow-sm transition hover:shadow-md md:grid-cols-2"
        >
          <div className={`h-56 md:h-full ${featured.coverImageUrl ? "" : "bg-navy-100"}`}>
            {featured.coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={featured.coverImageUrl} alt={featured.title} className="h-full w-full object-contain" />
            )}
          </div>
          <div className="flex flex-col justify-center p-6">
            <span className="mb-2 w-fit rounded-full bg-orange-50 px-2 py-1 text-xs text-orange-600">
              مقاله ویژه
            </span>
            <h2 className="mb-2 text-xl font-bold text-navy-800">{featured.title}</h2>
            {featured.excerpt && <p className="text-sm text-navy-400">{featured.excerpt}</p>}
            {featured.publishedAt && (
              <p className="mt-4 text-xs text-navy-400">
                {new Intl.DateTimeFormat("fa-IR").format(new Date(featured.publishedAt))}
              </p>
            )}
          </div>
        </Link>
      )}

      <h2 className="mb-6 text-lg font-bold text-navy-800">جدیدترین مقالات</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="overflow-hidden rounded-card bg-white shadow-sm transition hover:shadow-md"
          >
            <div className={`h-40 ${article.coverImageUrl ? "" : "bg-navy-100"}`}>
              {article.coverImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={article.coverImageUrl} alt={article.title} className="h-full w-full object-contain" />
              )}
            </div>
            <div className="p-4">
              {article.category && (
                <span className="mb-2 inline-block rounded-full bg-navy-50 px-2 py-1 text-xs text-navy-600">
                  {article.category.title}
                </span>
              )}
              <h3 className="mb-2 font-semibold text-navy-800">{article.title}</h3>
              {article.excerpt && <p className="line-clamp-2 text-sm text-navy-400">{article.excerpt}</p>}
              {article.publishedAt && (
                <p className="mt-3 text-xs text-navy-400">
                  {new Intl.DateTimeFormat("fa-IR").format(new Date(article.publishedAt))}
                </p>
              )}
            </div>
          </Link>
        ))}
        {pageItems.length === 0 && !featured && (
          <p className="col-span-full text-center text-navy-400">هنوز مقاله‌ای منتشر نشده است.</p>
        )}
      </div>

      {/* صفحه‌بندی */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${
                p === currentPage ? "bg-navy-800 text-white" : "bg-white text-navy-600 hover:bg-navy-50"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
