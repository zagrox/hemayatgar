import { serverApiFetch } from "@/lib/server-api";

interface RequestRow {
  id: string;
  fullName: string;
  mobile: string;
  status: "NEW" | "IN_PROGRESS" | "CONTACTED" | "CONVERTED" | "CLOSED";
  createdAt: string;
  insuranceCategory: { title: string } | null;
  assignedTo: { fullName: string } | null;
}

const STATUS_LABELS: Record<string, string> = {
  NEW: "جدید",
  IN_PROGRESS: "در حال پیگیری",
  CONTACTED: "تماس گرفته شده",
  CONVERTED: "تبدیل به مشتری",
  CLOSED: "بسته‌شده",
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-orange-50 text-orange-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  CONTACTED: "bg-navy-50 text-navy-600",
  CONVERTED: "bg-green-50 text-green-700",
  CLOSED: "bg-gray-100 text-gray-500",
};

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const query = status ? `?status=${status}` : "";
  const requests = await serverApiFetch<RequestRow[]>(`/api/admin/requests${query}`);

  const filters = [
    { label: "همه", value: "" },
    { label: "جدید", value: "NEW" },
    { label: "در حال پیگیری", value: "IN_PROGRESS" },
    { label: "تماس گرفته شده", value: "CONTACTED" },
    { label: "تبدیل به مشتری", value: "CONVERTED" },
    { label: "بسته‌شده", value: "CLOSED" },
  ];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-navy-800">درخواست‌های مشاوره</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <a
            key={filter.value}
            href={filter.value ? `/admin/requests?status=${filter.value}` : "/admin/requests"}
            className={`rounded-full px-3 py-1.5 text-xs ${
              (status ?? "") === filter.value
                ? "bg-navy-700 text-white"
                : "bg-white text-navy-600 hover:bg-navy-50"
            }`}
          >
            {filter.label}
          </a>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-right text-sm">
          <thead className="bg-navy-50 text-navy-600">
            <tr>
              <th className="px-4 py-3">نام</th>
              <th className="px-4 py-3">موبایل</th>
              <th className="px-4 py-3">نوع بیمه</th>
              <th className="px-4 py-3">مسئول پیگیری</th>
              <th className="px-4 py-3">وضعیت</th>
              <th className="px-4 py-3">تاریخ ثبت</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b border-navy-50">
                <td className="px-4 py-3">{request.fullName}</td>
                <td className="px-4 py-3" dir="ltr">{request.mobile}</td>
                <td className="px-4 py-3">{request.insuranceCategory?.title ?? "-"}</td>
                <td className="px-4 py-3">{request.assignedTo?.fullName ?? "تخصیص‌نیافته"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${STATUS_COLORS[request.status]}`}>
                    {STATUS_LABELS[request.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-navy-500">
                  {new Intl.DateTimeFormat("fa-IR").format(new Date(request.createdAt))}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-navy-400">
                  درخواستی با این فیلتر یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-navy-400">
        صفحه جزئیات هر درخواست (تغییر وضعیت، تخصیص به کارشناس، ثبت یادداشت داخلی) در تکمیل رابط
        کاربری این بخش اضافه می‌شود؛ API آن (GET/PATCH /api/admin/requests/:id و POST
        /api/admin/requests/:id/notes) از هم‌اکنون آماده است.
      </p>
    </div>
  );
}
