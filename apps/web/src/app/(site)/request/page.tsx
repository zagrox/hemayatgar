import { Breadcrumb } from "@/components/site/Breadcrumb";
import { ConsultationRequestForm } from "@/components/ConsultationRequestForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface ContactSettings {
  phone: string | null;
  mobile: string | null;
  workingHours: string | null;
}

async function getSettings(): Promise<ContactSettings | null> {
  try {
    const res = await fetch(`${API_URL}/api/site-settings`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const STEPS = [
  { number: "۱", title: "ثبت درخواست", desc: "فرم را تکمیل کنید و درخواست خود را ثبت نمایید" },
  { number: "۲", title: "تماس کارشناسان", desc: "کارشناسان ما با شما تماس می‌گیرند و مشاوره رایگان ارائه می‌دهند" },
  { number: "۳", title: "صدور بیمه‌نامه", desc: "پس از انتخاب بهترین گزینه، بیمه‌نامه شما صادر می‌شود" },
];

export const metadata = { title: "درخواست مشاوره و صدور بیمه‌نامه" };

export default async function RequestConsultationPage() {
  const settings = await getSettings();

  return (
    <div>
      <section className="bg-gradient-to-b from-navy-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Breadcrumb items={[{ label: "صفحه اصلی", href: "/" }, { label: "درخواست مشاوره" }]} />

          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <p className="mb-2 text-sm font-medium text-orange-600">
                در چند دقیقه، بیمه مناسب خود را انتخاب کنید
              </p>
              <h1 className="mb-4 text-2xl font-extrabold text-navy-900 md:text-4xl">
                درخواست مشاوره و صدور بیمه‌نامه
              </h1>
              <p className="mb-6 text-sm leading-7 text-navy-500">
                فرم زیر را تکمیل کنید تا کارشناسان ما در اسرع وقت با شما تماس بگیرند و بهترین
                پیشنهاد را ارائه دهند.
              </p>
            </div>
            <div className="order-1 h-56 rounded-card bg-navy-100 md:order-2 md:h-72" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-xl px-4 pb-4">
        <ConsultationRequestForm />
      </div>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="mb-10 text-center text-lg font-bold text-navy-800">
          با چند قدم ساده، بیمه مناسب خود را دریافت کنید
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="rounded-card bg-white p-5 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-white">
                {step.number}
              </div>
              <p className="mb-1 font-semibold text-navy-800">{step.title}</p>
              <p className="text-xs text-navy-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy-50 py-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-4 text-center text-sm text-navy-600 md:flex-row">
          <p>نیاز به راهنمایی دارید؟ با ما تماس بگیرید.</p>
          {(settings?.phone || settings?.mobile) && (
            <p dir="ltr" className="font-semibold text-navy-800">
              {settings.phone ?? settings.mobile}
            </p>
          )}
          {settings?.workingHours && <p>ساعات پاسخگویی: {settings.workingHours}</p>}
        </div>
      </section>
    </div>
  );
}
