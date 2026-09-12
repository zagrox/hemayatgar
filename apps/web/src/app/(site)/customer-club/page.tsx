import { getStaticPage } from "@/lib/content";
import { PageSectionRenderer, getPageSections } from "@/components/site/PageSectionRenderer";
import { Breadcrumb } from "@/components/site/Breadcrumb";

const BENEFITS = [
  { title: "تخفیف تمدید بیمه‌نامه", desc: "مزایای ویژه برای مشتریان وفادار حمایتگر" },
  { title: "اولویت در رسیدگی به خسارت", desc: "پیگیری سریع‌تر پرونده‌های خسارت اعضای باشگاه" },
  { title: "معرفی به دوستان", desc: "با معرفی آشنایان خود، از پاداش‌های ویژه بهره‌مند شوید" },
  { title: "اطلاع‌رسانی زودهنگام", desc: "آگاهی از طرح‌ها و تخفیف‌های فصلی پیش از دیگران" },
];

export const metadata = { title: "باشگاه مشتریان" };

export default async function CustomerClubPage() {
  const [page, sections] = await Promise.all([
    getStaticPage("customer-club"),
    getPageSections("customer-club"),
  ]);

  return (
    <>
      <section className="bg-gradient-to-b from-navy-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-10 text-center">
          <Breadcrumb items={[{ label: "صفحه اصلی", href: "/" }, { label: "باشگاه مشتریان" }]} />
          <h1 className="mb-4 text-2xl font-bold text-navy-900 md:text-3xl">
            {page?.title ?? "باشگاه مشتریان حمایتگر"}
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-navy-500">
            {page?.content ? (
              <span dangerouslySetInnerHTML={{ __html: page.content }} />
            ) : (
              "به عضویت باشگاه مشتریان حمایتگر درآیید و از مزایای ویژه‌ای که فقط برای مشتریان وفادار ما در نظر گرفته شده، بهره‌مند شوید."
            )}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="rounded-card bg-white p-5 shadow-sm">
              <p className="mb-1 font-semibold text-navy-800">{benefit.title}</p>
              <p className="text-sm text-navy-400">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <PageSectionRenderer sections={sections} />

      <section className="bg-navy-800 py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-right">
          <div>
            <p className="text-lg font-bold text-white">همین حالا عضو باشگاه مشتریان شوید</p>
            <p className="text-sm text-navy-200">با ثبت درخواست، از مزایای ویژه بهره‌مند شوید</p>
          </div>
          <a
            href="/request"
            className="rounded-btn bg-white px-6 py-3 text-sm font-medium text-navy-800 hover:bg-navy-50"
          >
            عضویت رایگان
          </a>
        </div>
      </section>
    </>
  );
}
