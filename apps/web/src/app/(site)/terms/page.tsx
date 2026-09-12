import { getStaticPage } from "@/lib/content";
import { Breadcrumb } from "@/components/site/Breadcrumb";

export const metadata = { title: "قوانین و مقررات استفاده" };

export default async function TermsPage() {
  const page = await getStaticPage("terms");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumb items={[{ label: "صفحه اصلی", href: "/" }, { label: "قوانین و مقررات" }]} />
      <h1 className="mb-6 text-2xl font-bold text-navy-800">{page?.title ?? "قوانین و مقررات استفاده"}</h1>
      {page?.content ? (
        <div
          className="prose prose-navy max-w-none text-sm leading-8 text-navy-700"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <p className="text-sm leading-8 text-navy-500">
          این صفحه محل قرارگیری قوانین و شرایط استفاده از خدمات سایت حمایتگر است؛ متن کامل آن از
          پنل مدیریت (یا دستیار هوش مصنوعی) قابل تکمیل است.
        </p>
      )}
    </div>
  );
}
