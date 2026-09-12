import Link from "next/link";

const SECTIONS = [
  { href: "/admin/content/pages", title: "صفحات ثابت", desc: "درباره ما، تماس با ما، همکاری با ما و ..." },
  { href: "/admin/content/slider", title: "اسلایدر", desc: "اسلایدهای صفحه اصلی" },
  { href: "/admin/content/media", title: "کتابخانه تصاویر", desc: "آپلود و مدیریت تصاویر سایت" },
  { href: "/admin/content/articles", title: "مقالات وبلاگ", desc: "نوشتن و انتشار مطالب وبلاگ" },
  { href: "/admin/content/faq", title: "سوالات متداول", desc: "مدیریت FAQ صفحات و رشته‌های بیمه" },
];

export default function ContentHubPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-800">مدیریت محتوا</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <h2 className="mb-1 font-semibold text-navy-800">{section.title}</h2>
            <p className="text-sm text-navy-500">{section.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
