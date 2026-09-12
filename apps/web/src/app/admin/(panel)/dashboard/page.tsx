import { serverApiFetch } from "@/lib/server-api";

interface DashboardStats {
  totalRequests: number;
  newRequests: number;
  totalCustomers: number;
  totalArticles: number;
  publishedArticles: number;
  totalInsuranceCategories: number;
  recentRequests: {
    id: string;
    fullName: string;
    mobile: string;
    status: string;
    createdAt: string;
    insuranceCategory: { title: string } | null;
  }[];
}

const STATUS_LABELS: Record<string, string> = {
  NEW: "جدید",
  IN_PROGRESS: "در حال پیگیری",
  CONTACTED: "تماس گرفته شده",
  CONVERTED: "تبدیل به مشتری",
  CLOSED: "بسته‌شده",
};

export default async function DashboardPage() {
  const stats = await serverApiFetch<DashboardStats>("/api/admin/dashboard/stats");

  const cards = [
    { label: "کل درخواست‌ها", value: stats.totalRequests },
    { label: "درخواست‌های جدید", value: stats.newRequests },
    { label: "مشتریان", value: stats.totalCustomers },
    { label: "مقالات منتشرشده", value: `${stats.publishedArticles} / ${stats.totalArticles}` },
    { label: "رشته‌های بیمه فعال", value: stats.totalInsuranceCategories },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-800">داشبورد</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-navy-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-navy-800">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-navy-800">آخرین درخواست‌های مشاوره</h2>
        <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-navy-100 text-navy-500">
              <th className="pb-2">نام</th>
              <th className="pb-2">موبایل</th>
              <th className="pb-2">نوع بیمه</th>
              <th className="pb-2">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentRequests.map((request) => (
              <tr key={request.id} className="border-b border-navy-50">
                <td className="py-2">{request.fullName}</td>
                <td className="py-2">{request.mobile}</td>
                <td className="py-2">{request.insuranceCategory?.title ?? "-"}</td>
                <td className="py-2">
                  <span className="rounded-full bg-orange-50 px-2 py-1 text-xs text-orange-700">
                    {STATUS_LABELS[request.status] ?? request.status}
                  </span>
                </td>
              </tr>
            ))}
            {stats.recentRequests.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-navy-400">
                  هنوز درخواستی ثبت نشده است
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
