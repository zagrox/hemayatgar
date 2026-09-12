const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface StaticPageContent {
  title: string;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  faqs: { id: string; question: string; answer: string }[];
}

export async function getStaticPage(slug: string): Promise<StaticPageContent | null> {
  try {
    const res = await fetch(`${API_URL}/api/pages/${slug}`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
