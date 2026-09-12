import Link from "next/link";
import { serverApiFetch } from "@/lib/server-api";
import { AddArticleForm } from "./AddArticleForm";

interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  category: { title: string } | null;
  author: { fullName: string } | null;
  createdAt: string;
}

export default async function ArticlesListPage() {
  const articles = await serverApiFetch<ArticleRow[]>("/api/admin/articles");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-800">مقالات وبلاگ</h1>
        <Link
          href="/admin/content"
          className="text-sm text-navy-500 hover:text-navy-700"
        >
          ← بازگشت به مدیریت محتوا
        </Link>
      </div>

      <AddArticleForm />

      <div className="overflow-x-auto rounded-card bg-white shadow-sm">
        <table className="w-full text-right text-sm">
          <thead className="bg-navy-50 text-navy-600">
            <tr>
              <th className="px-4 py-3">عنوان</th>
              <th className="px-4 py-3">دسته‌بندی</th>
              <th className="px-4 py-3">نویسنده</th>
              <th className="px-4 py-3">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-navy-50">
                <td className="px-4 py-3">{article.title}</td>
                <td className="px-4 py-3">{article.category?.title ?? "-"}</td>
                <td className="px-4 py-3">{article.author?.fullName ?? "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      article.status === "PUBLISHED"
                        ? "bg-green-50 text-green-700"
                        : "bg-navy-50 text-navy-500"
                    }`}
                  >
                    {article.status === "PUBLISHED" ? "منتشرشده" : "پیش‌نویس"}
                  </span>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-navy-400">
                  هنوز مقاله‌ای ثبت نشده است
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
