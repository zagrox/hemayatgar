import { notFound } from "next/navigation";
import { PageSectionRenderer, getPageSections } from "@/components/site/PageSectionRenderer";
import { Breadcrumb } from "@/components/site/Breadcrumb";

interface ArticleDetail {
  id: string;
  title: string;
  content: string;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  category: { title: string } | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function getArticle(slug: string): Promise<ArticleDetail | null> {
  const res = await fetch(`${API_URL}/api/articles/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? undefined,
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, dynamicSections] = await Promise.all([
    getArticle(slug),
    getPageSections(`article-${slug}`),
  ]);
  if (!article) notFound();

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-12">
        <Breadcrumb
          items={[{ label: "صفحه اصلی", href: "/" }, { label: "مقالات", href: "/blog" }, { label: article.title }]}
        />
        {article.category && (
          <span className="mb-3 inline-block rounded-full bg-navy-50 px-2 py-1 text-xs text-navy-600">
            {article.category.title}
          </span>
        )}
        <h1 className="mb-4 text-2xl font-bold text-navy-900">{article.title}</h1>
        {article.publishedAt && (
          <p className="mb-6 text-xs text-navy-400">
            {new Intl.DateTimeFormat("fa-IR").format(new Date(article.publishedAt))}
          </p>
        )}
        <div
          className="prose prose-navy max-w-none text-sm leading-8 text-navy-700"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
      <PageSectionRenderer sections={dynamicSections} />
    </>
  );
}
