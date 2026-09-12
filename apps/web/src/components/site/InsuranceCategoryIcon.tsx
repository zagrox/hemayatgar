interface IconProps {
  className?: string;
}

const strokeProps = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function CarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} {...strokeProps}>
      <path d="M6 24l2.5-8a3 3 0 0 1 2.8-2h17.4a3 3 0 0 1 2.8 2l2.5 8" />
      <rect x="5" y="24" width="30" height="7" rx="2" />
      <circle cx="12" cy="31" r="2.3" fill="currentColor" stroke="none" />
      <circle cx="28" cy="31" r="2.3" fill="currentColor" stroke="none" />
      <path d="M10 24h20" />
    </svg>
  );
}

function LiabilityIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} {...strokeProps}>
      <circle cx="14" cy="14" r="4" />
      <circle cx="26" cy="14" r="4" />
      <path d="M6 30c0-5 3.5-8 8-8s8 3 8 8" />
      <path d="M18 30c0-5 3.5-8 8-8s8 3 8 8" />
    </svg>
  );
}

function FireIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} {...strokeProps}>
      <path d="M20 6c4 5-3 7-1 12 1-2 3-2 4-1 2 2 1 6-3 8-5 2.5-11-1-11-7 0-6 5-8 4-13 3 1 5 0 7-1z" />
    </svg>
  );
}

function LifeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} {...strokeProps}>
      <circle cx="20" cy="11" r="5" />
      <path d="M8 32c0-7 5-12 12-12s12 5 12 12" />
    </svg>
  );
}

function EngineeringIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} {...strokeProps}>
      <path d="M8 32V16l10-8 10 8v16" />
      <path d="M14 32V20h8v12" />
      <path d="M6 32h28" />
    </svg>
  );
}

function TransportIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} {...strokeProps}>
      <rect x="5" y="12" width="18" height="14" rx="1.5" />
      <path d="M23 17h6l4 4v5h-10z" />
      <circle cx="12" cy="29" r="2.3" fill="currentColor" stroke="none" />
      <circle cx="28" cy="29" r="2.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function EnergyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} {...strokeProps}>
      <path d="M21 5 9 22h8l-2 13 14-18h-9l1-12z" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} {...strokeProps}>
      <path d="M20 5l12 4v9c0 8-5 13.5-12 17-7-3.5-12-9-12-17V9z" />
      <path d="M14 20l4 4 8-8" />
    </svg>
  );
}

const ICONS_BY_SLUG: Record<string, (props: IconProps) => React.JSX.Element> = {
  car: CarIcon,
  liability: LiabilityIcon,
  fire: FireIcon,
  life: LifeIcon,
  engineering: EngineeringIcon,
  transport: TransportIcon,
  energy: EnergyIcon,
};

export function InsuranceCategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = ICONS_BY_SLUG[slug] ?? ShieldIcon;
  return <Icon className={className ?? "h-8 w-8 text-navy-700"} />;
}
