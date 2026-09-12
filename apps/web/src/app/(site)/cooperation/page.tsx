import { getStaticPage } from "@/lib/content";
import { PageSectionRenderer, getPageSections } from "@/components/site/PageSectionRenderer";
import { Breadcrumb } from "@/components/site/Breadcrumb";

export const metadata = { title: "همکاری با ما" };

export default async function CooperationPage() {
  const [page, sections] = await Promise.all([
    getStaticPage("cooperation"),
    getPageSections("cooperation"),
  ]);

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Breadcrumb items={[{ label: "صفحه اصلی", href: "/" }, { label: "همکاری با ما" }]} />
        <h1 className="mb-6 text-2xl font-bold text-navy-800">{page?.title ?? "همکاری با ما"}</h1>
        {page?.content ? (
          <div
            className="prose prose-navy max-w-none text-sm leading-8 text-navy-700"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        ) : (
          <p className="text-sm leading-8 text-navy-500">
            محتوای شرایط همکاری از پنل مدیریت (مدیریت صفحات) قابل تکمیل و ویرایش است.
          </p>
        )}
      </div>
      <PageSectionRenderer sections={sections} />
    </>
  );
}
