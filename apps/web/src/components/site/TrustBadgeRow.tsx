const BADGES = [
  { icon: "headset", title: "پشتیبانی ۲۴ ساعته", subtitle: "در تمام روزهای هفته" },
  { icon: "bolt", title: "پرداخت سریع خسارت", subtitle: "بدون بروکراسی" },
  { icon: "shield", title: "نماینده معتبر", subtitle: "از شرکت بیمه ایران" },
];

function BadgeIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const common = { fill: "none" as const, stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "headset") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="M4 13a8 8 0 0 1 16 0" />
        <rect x="3" y="13" width="4" height="6" rx="1.5" />
        <rect x="17" y="13" width="4" height="6" rx="1.5" />
        <path d="M19 19v1a3 3 0 0 1-3 3h-2" />
      </svg>
    );
  }
  if (name === "bolt") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} {...common}>
      <path d="M12 3l7 2.5v5.5c0 4.8-3 8.2-7 10-4-1.8-7-5.2-7-10V5.5z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function TrustBadgeRow({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex flex-col gap-1.5">
        {BADGES.map((badge) => (
          <div key={badge.title} className="flex items-center gap-1.5 text-navy-700">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-50">
              <BadgeIcon name={badge.icon} className="h-3 w-3" />
            </div>
            <p className="text-[10px] font-medium leading-tight">{badge.title}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6">
      {BADGES.map((badge) => (
        <div key={badge.title} className="flex items-center gap-2 text-navy-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-50">
            <BadgeIcon name={badge.icon} />
          </div>
          <div>
            <p className="text-xs font-semibold">{badge.title}</p>
            <p className="text-[11px] text-navy-400">{badge.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
