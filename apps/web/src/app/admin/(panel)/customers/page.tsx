import { serverApiFetch } from "@/lib/server-api";

interface CustomerRow {
  id: string;
  fullName: string;
  mobile: string;
  email: string | null;
  createdAt: string;
  _count: { requests: number; interactions: number };
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const customers = await serverApiFetch<CustomerRow[]>(`/api/admin/customers${query}`);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-navy-800">مشتریان</h1>

      <form className="mb-4" action="/admin/customers" method="get">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="جستجو بر اساس نام، موبایل یا ایمیل..."
          className="w-full max-w-sm rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none md:w-80"
        />
      </form>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-right text-sm">
          <thead className="bg-navy-50 text-navy-600">
            <tr>
              <th className="px-4 py-3">نام</th>
              <th className="px-4 py-3">موبایل</th>
              <th className="px-4 py-3">ایمیل</th>
              <th className="px-4 py-3">تعداد درخواست</th>
              <th className="px-4 py-3">سوابق ارتباط</th>
              <th className="px-4 py-3">عضویت از</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-navy-50">
                <td className="px-4 py-3">{customer.fullName}</td>
                <td className="px-4 py-3" dir="ltr">{customer.mobile}</td>
                <td className="px-4 py-3">{customer.email ?? "-"}</td>
                <td className="px-4 py-3">{customer._count.requests}</td>
                <td className="px-4 py-3">{customer._count.interactions}</td>
                <td className="px-4 py-3 text-navy-500">
                  {new Intl.DateTimeFormat("fa-IR").format(new Date(customer.createdAt))}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-navy-400">
                  مشتری‌ای یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-navy-400">
        صفحه جزئیات هر مشتری (سوابق ارتباط و افزودن یادداشت تماس/جلسه) در تکمیل رابط کاربری این
        بخش اضافه می‌شود؛ API آن (GET /api/admin/customers/:id و POST
        /api/admin/customers/:id/interactions) از هم‌اکنون آماده است.
      </p>
    </div>
  );
}
