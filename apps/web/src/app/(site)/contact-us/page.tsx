import { getStaticPage } from "@/lib/content";
import { PageSectionRenderer, getPageSections } from "@/components/site/PageSectionRenderer";
import { Breadcrumb } from "@/components/site/Breadcrumb";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface SiteSettingsPublic {
  phone: string | null;
  mobile: string | null;
  email: string | null;
  address: string | null;
  workingHours: string | null;
}

async function getSettings(): Promise<SiteSettingsPublic | null> {
  try {
    const res = await fetch(`${API_URL}/api/site-settings`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export const metadata = { title: "تماس با ما" };

export default async function ContactUsPage() {
  const [page, settings, sections] = await Promise.all([
    getStaticPage("contact-us"),
    getSettings(),
    getPageSections("contact-us"),
  ]);

  return (
    <>
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumb items={[{ label: "صفحه اصلی", href: "/" }, { label: "تماس با ما" }]} />
      <h1 className="mb-6 text-2xl font-bold text-navy-800">{page?.title ?? "تماس با ما"}</h1>

      {page?.content && (
        <div
          className="prose prose-navy mb-8 max-w-none text-sm leading-8 text-navy-700"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      )}

      <div className="grid grid-cols-1 gap-4 rounded-card bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-navy-600">تلفن تماس</p>
          <p className="mt-1 text-sm text-navy-800" dir="ltr">{settings?.phone ?? settings?.mobile ?? "-"}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-600">ایمیل</p>
          <p className="mt-1 text-sm text-navy-800" dir="ltr">{settings?.email ?? "-"}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-600">آدرس دفتر</p>
          <p className="mt-1 text-sm text-navy-800">{settings?.address ?? "-"}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-600">ساعات پاسخگویی</p>
          <p className="mt-1 text-sm text-navy-800">{settings?.workingHours ?? "-"}</p>
        </div>
      </div>
    </div>
    <PageSectionRenderer sections={sections} />
    </>
  );
}
