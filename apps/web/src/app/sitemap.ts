import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function safeFetchJson<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, articles] = await Promise.all([
    safeFetchJson<{ slug: string }>(`${API_URL}/api/insurance-categories`),
    safeFetchJson<{ slug: string }>(`${API_URL}/api/articles`),
  ]);

  const staticRoutes = [
    "",
    "/insurance",
    "/blog",
    "/about-us",
    "/contact-us",
    "/cooperation",
    "/faq",
    "/request",
    "/customer-club",
    "/rates",
    "/privacy-policy",
    "/terms",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${SITE_URL}/insurance/${c.slug}`,
    lastModified: new Date(),
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
