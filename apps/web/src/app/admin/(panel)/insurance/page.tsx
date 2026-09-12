import { serverApiFetch } from "@/lib/server-api";

interface SubsectionRow {
  id: string;
  title: string;
  isActive: boolean;
}

interface CategoryRow {
  id: string;
  slug: string;
  title: string;
  isActive: boolean;
  subsections: SubsectionRow[];
}

export default async function InsuranceCategoriesPage() {
  const categories = await serverApiFetch<CategoryRow[]>("/api/admin/insurance-categories");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-800">رشته‌های بیمه</h1>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-navy-800">{category.title}</h2>
                <p className="text-xs text-navy-400">/{category.slug}</p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  category.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {category.isActive ? "فعال" : "غیرفعال"}
              </span>
            </div>

            {category.subsections.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {category.subsections.map((sub) => (
                  <span
                    key={sub.id}
                    className="rounded-full bg-navy-50 px-3 py-1 text-xs text-navy-600"
                  >
                    {sub.title}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-navy-400">هنوز زیررشته‌ای برای این رشته ثبت نشده است</p>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-navy-400">
        فرم افزودن/ویرایش رشته و زیررشته‌ها (معرفی، پوشش‌ها، استثناء، مزایا) در تکمیل رابط کاربری
        این بخش اضافه می‌شود؛ API آن از هم‌اکنون آماده است.
      </p>
    </div>
  );
}
