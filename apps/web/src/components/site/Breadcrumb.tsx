import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="مسیر ناوبری" className="mb-3 flex flex-wrap items-center gap-1 text-xs text-navy-400">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1">
          {item.href ? (
            <Link href={item.href} className="hover:text-navy-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-navy-600">{item.label}</span>
          )}
          {idx < items.length - 1 && <span className="text-navy-300">‹</span>}
        </span>
      ))}
    </nav>
  );
}
