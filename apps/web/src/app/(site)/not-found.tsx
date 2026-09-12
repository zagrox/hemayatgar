import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-6xl font-extrabold text-navy-200">۴۰۴</p>
      <h1 className="mb-3 text-xl font-bold text-navy-800">صفحه مورد نظر پیدا نشد</h1>
      <p className="mb-6 max-w-sm text-sm text-navy-500">
        ممکن است این صفحه حذف شده یا آدرس اشتباه وارد شده باشد.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-btn bg-navy-800 px-6 py-3 text-sm font-medium text-white hover:bg-navy-900">
          بازگشت به صفحه اصلی
        </Link>
        <Link
          href="/search"
          className="rounded-btn border border-navy-200 bg-white px-6 py-3 text-sm font-medium text-navy-700 hover:bg-navy-50"
        >
          جستجو در سایت
        </Link>
      </div>
    </div>
  );
}
