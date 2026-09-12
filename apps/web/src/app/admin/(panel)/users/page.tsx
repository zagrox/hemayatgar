import { serverApiFetch } from "@/lib/server-api";
import { AddUserForm } from "./AddUserForm";

interface AdminUserRow {
  id: string;
  fullName: string;
  email: string;
  mobile: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  role: { label: string };
}

export default async function UsersPage() {
  const users = await serverApiFetch<AdminUserRow[]>("/api/admin/users");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-800">مدیریت کاربران پنل</h1>

      <AddUserForm />

      <div className="overflow-x-auto rounded-card bg-white shadow-sm">
        <table className="w-full text-right text-sm">
          <thead className="bg-navy-50 text-navy-600">
            <tr>
              <th className="px-4 py-3">نام</th>
              <th className="px-4 py-3">ایمیل</th>
              <th className="px-4 py-3">نقش</th>
              <th className="px-4 py-3">آخرین ورود</th>
              <th className="px-4 py-3">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-navy-50">
                <td className="px-4 py-3">{user.fullName}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role.label}</td>
                <td className="px-4 py-3">
                  {user.lastLoginAt
                    ? new Intl.DateTimeFormat("fa-IR").format(new Date(user.lastLoginAt))
                    : "بدون ورود قبلی"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      user.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {user.isActive ? "فعال" : "غیرفعال"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
