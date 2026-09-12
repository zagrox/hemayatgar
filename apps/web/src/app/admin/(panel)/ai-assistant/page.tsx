"use client";

import { useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ActionPerformed {
  tool: string;
  result: unknown;
}

const TOOL_LABELS: Record<string, string> = {
  create_article: "نوشتن مقاله جدید",
  update_article: "ویرایش مقاله",
  delete_article: "حذف مقاله",
  update_insurance_subsection_content: "ویرایش محتوای زیررشته بیمه",
  update_static_page_content: "ویرایش صفحه ثابت",
  set_image: "جایگزینی تصویر",
  delete_slider_item: "حذف اسلاید",
  delete_media_file: "حذف تصویر از کتابخانه",
  list_requests: "مشاهده درخواست‌ها",
  update_request_status: "تغییر وضعیت درخواست",
  add_request_note: "ثبت یادداشت روی درخواست",
  list_customers: "مشاهده مشتریان",
  add_customer_interaction: "ثبت سابقه ارتباط با مشتری",
  get_site_settings: "مشاهده تنظیمات سایت",
  update_site_settings: "ویرایش تنظیمات سایت",
  update_site_theme: "تغییر رنگ/فونت سایت",
};

export default function AiAssistantPage() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/ai/status`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setEnabled(data.enabled))
      .catch(() => setEnabled(false));
  }, []);

  async function handleSend() {
    if (!input.trim() && !imageFile) return;
    setError(null);
    setIsLoading(true);

    const userDisplayMessage = input || "(یک تصویر ارسال شد)";
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: userDisplayMessage }];
    setMessages(nextMessages);
    setInput("");

    try {
      const formData = new FormData();
      formData.append("message", input || "این تصویر را جایگزین کن");
      formData.append("history", JSON.stringify(messages));
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${API_URL}/api/admin/ai/chat`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message);
      }

      const data: { reply: string; actionsPerformed: ActionPerformed[] } = await res.json();
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);

      if (data.actionsPerformed.length > 0) {
        const summary = data.actionsPerformed
          .map((a) => `✅ ${TOOL_LABELS[a.tool] ?? a.tool}`)
          .join("\n");
        setMessages((prev) => [...prev, { role: "assistant", content: summary }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ارتباط با دستیار");
    } finally {
      setIsLoading(false);
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (enabled === false) {
    return (
      <div className="rounded-xl bg-orange-50 p-6 text-sm text-orange-700">
        دستیار هوش مصنوعی هنوز فعال نیست. برای فعال‌سازی، مقدار{" "}
        <code className="rounded bg-white px-1">ANTHROPIC_API_KEY</code> را در فایل{" "}
        <code className="rounded bg-white px-1">.env</code> سرور تنظیم کنید.
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-3xl flex-col md:h-[calc(100vh-8rem)]">
      <h1 className="mb-4 text-2xl font-bold text-navy-800">دستیار هوش مصنوعی سایت</h1>
      <p className="mb-4 text-sm text-navy-400">
        مثلاً بگو «یک مقاله درباره بیمه آتش‌سوزی بنویس» یا یک عکس بفرست و بگو «این را عکس شاخص بیمه
        خودرو کن».
      </p>

      <div className="mb-4 flex-1 space-y-3 overflow-y-auto rounded-xl bg-white p-4 shadow-sm">
        {messages.length === 0 && (
          <p className="text-center text-sm text-navy-400">گفتگو رو شروع کن...</p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${
              msg.role === "user"
                ? "mr-auto bg-navy-700 text-white"
                : "ml-auto bg-navy-50 text-navy-800"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && <p className="text-xs text-navy-400">در حال فکر کردن...</p>}
      </div>

      {error && <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="flex flex-col gap-2 md:flex-row md:items-end">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="w-full text-xs md:w-32"
        />
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={2}
          placeholder="پیام خود را بنویسید..."
          className="flex-1 rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
        >
          ارسال
        </button>
      </div>
      {imageFile && <p className="mt-1 text-xs text-navy-400">تصویر ضمیمه: {imageFile.name}</p>}
    </div>
  );
}
