import { Breadcrumb } from "@/components/site/Breadcrumb";

interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function getGlobalFaqs(): Promise<FaqEntry[]> {
  try {
    const res = await fetch(`${API_URL}/api/faq?global=true`, { next: { revalidate: 120 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export const metadata = { title: "سوالات متداول" };

export default async function FaqPage() {
  const faqs = await getGlobalFaqs();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumb items={[{ label: "صفحه اصلی", href: "/" }, { label: "سوالات متداول" }]} />
      <h1 className="mb-8 text-2xl font-bold text-navy-800">سوالات متداول</h1>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <details key={faq.id} className="rounded-card bg-white p-4 shadow-sm">
            <summary className="cursor-pointer font-medium text-navy-800">{faq.question}</summary>
            <p className="mt-2 text-sm leading-7 text-navy-500">{faq.answer}</p>
          </details>
        ))}
        {faqs.length === 0 && (
          <p className="text-center text-navy-400">سوالات متداول از پنل مدیریت اضافه می‌شوند.</p>
        )}
      </div>
    </div>
  );
}
