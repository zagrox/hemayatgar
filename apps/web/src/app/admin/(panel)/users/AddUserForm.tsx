"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface Role {
  id: string;
  label: string;
}

export function AddUserForm() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && roles.length === 0) {
      apiFetch<Role[]>("/api/admin/users/roles/list")
        .then(setRoles)
        .catch(() => setRoles([]));
    }
  }, [isOpen, roles.length]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await apiFetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password, roleId }),
      });
      setIsOpen(false);
      setFullName("");
      setEmail("");
      setPassword("");
      setRoleId("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ساخت کاربر");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mb-4 rounded-btn bg-navy-800 px-4 py-2 text-sm text-white hover:bg-navy-900"
      >
        + کاربر جدید
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-card bg-white p-5 shadow-sm">
      <h2 className="mb-2 font-semibold text-navy-800">افزودن کاربر جدید</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          required
          placeholder="نام کامل"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="rounded-lg border border-navy-200 px-3 py-2 text-sm"
        />
        <input
          required
          type="email"
          placeholder="ایمیل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-navy-200 px-3 py-2 text-sm"
        />
        <input
          required
          type="password"
          placeholder="رمز عبور موقت"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-navy-200 px-3 py-2 text-sm"
        />
        <select
          required
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          className="rounded-lg border border-navy-200 px-3 py-2 text-sm"
        >
          <option value="">انتخاب نقش</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-btn bg-navy-800 px-4 py-2 text-sm text-white hover:bg-navy-900 disabled:opacity-60"
        >
          {isLoading ? "در حال ساخت..." : "ساخت کاربر"}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-btn border border-navy-200 px-4 py-2 text-sm text-navy-600 hover:bg-navy-50"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}
