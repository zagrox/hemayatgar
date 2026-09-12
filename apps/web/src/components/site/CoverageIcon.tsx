interface IconProps {
  className?: string;
}

const s = { fill: "none" as const, stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function FireIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><path d="M20 6c4 5-3 7-1 12 1-2 3-2 4-1 2 2 1 6-3 8-5 2.5-11-1-11-7 0-6 5-8 4-13 3 1 5 0 7-1z" /></svg>;
}
function ExplosionIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><path d="M20 4l3 8 7-5-3 8 8 1-7 5 5 7-8-2 1 8-6-6-6 6 1-8-8 2 5-7-7-5 8-1-3-8 7 5z" /></svg>;
}
function LightningIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><path d="M22 4 10 22h8l-2 14 14-18h-8l2-14z" strokeLinejoin="round" /></svg>;
}
function FloodIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><path d="M5 24c3 3 6 3 9 0s6-3 9 0 6 3 9 0M5 31c3 3 6 3 9 0s6-3 9 0 6 3 9 0" /><path d="M20 6c3 6 6 9 6 13a6 6 0 1 1-12 0c0-4 3-7 6-13z" /></svg>;
}
function EarthquakeIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><path d="M4 26h6l3-7 4 12 4-10 3 5h6l4-6" /></svg>;
}
function StormIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><path d="M11 20a7 7 0 0 1 13-3 6 6 0 0 1 6 6 6 6 0 0 1-6 6H12a5 5 0 0 1-1-9.9z" /><path d="M14 30l-2 5M20 30l-2 5M26 30l-2 5" /></svg>;
}
function BurstPipeIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><path d="M8 16h16a5 5 0 0 1 5 5v11" /><path d="M20 26l3 3 3-3" /></svg>;
}
function SnowIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><path d="M20 6v28M8 13l24 14M32 13 8 27" /></svg>;
}
function PlaneCrashIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><path d="M6 30 30 10M17 10h9v9" /><path d="M22 22l5 5" /></svg>;
}
function CollisionIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><rect x="4" y="17" width="14" height="8" rx="2" /><rect x="22" y="17" width="14" height="8" rx="2" /><path d="M18 21h4" /></svg>;
}
function GlassBreakIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><rect x="7" y="7" width="26" height="26" rx="2" /><path d="M20 7v26M7 20h26M14 14l-4-4M26 26l4 4" /></svg>;
}
function LandslideIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><path d="M5 30l10-16 6 8 5-6 9 14z" /></svg>;
}
function GasLeakIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><rect x="13" y="14" width="14" height="20" rx="3" /><path d="M17 14V9a3 3 0 0 1 6 0v5" /></svg>;
}
function HailIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><circle cx="13" cy="16" r="3" /><circle cx="24" cy="14" r="3" /><circle cx="19" cy="24" r="3" /><circle cx="29" cy="26" r="3" /></svg>;
}
function FurnitureIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><path d="M8 22V14a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v8" /><rect x="6" y="22" width="28" height="7" rx="2" /><path d="M9 29v4M31 29v4" /></svg>;
}
function DemolitionIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><path d="M8 8l24 24M32 8 8 32" /></svg>;
}
function DocumentIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><rect x="10" y="5" width="20" height="30" rx="2" /><path d="M15 14h10M15 20h10M15 26h6" /></svg>;
}
function TheftIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><path d="M13 17V13a7 7 0 0 1 14 0v4" /><rect x="8" y="17" width="24" height="16" rx="3" /></svg>;
}
function MachineBreakIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><circle cx="15" cy="17" r="6" /><circle cx="27" cy="25" r="6" /><path d="M15 23l12-12" /></svg>;
}
function MedicalIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><rect x="7" y="7" width="26" height="26" rx="4" /><path d="M20 14v12M14 20h12" /></svg>;
}
function StaffCostIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><rect x="9" y="9" width="22" height="22" rx="3" /><path d="M15 25V17a5 5 0 0 1 10 0v8" /></svg>;
}
function RenovationIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><path d="M24 8l8 8-14 14-8-8z" /><path d="M8 30l2 2" /></svg>;
}
function ExtraCoverageIcon({ className }: IconProps) {
  return <svg viewBox="0 0 40 40" className={className} {...s}><path d="M20 5l12 4v9c0 8-5 13.5-12 17-7-3.5-12-9-12-17V9z" /><path d="M20 13v10M15 18h10" /></svg>;
}

const KEYWORD_ICON_MAP: { keywords: string[]; Icon: (props: IconProps) => React.JSX.Element }[] = [
  { keywords: ["آتش", "حریق"], Icon: FireIcon },
  { keywords: ["انفجار"], Icon: ExplosionIcon },
  { keywords: ["صاعقه", "برق‌گرفتگی"], Icon: LightningIcon },
  { keywords: ["سیل", "طغیان", "آب‌گرفتگی"], Icon: FloodIcon },
  { keywords: ["زلزله", "تندباد", "طوفان"], Icon: EarthquakeIcon },
  { keywords: ["گردباد", "توفان"], Icon: StormIcon },
  { keywords: ["ترکیدگی لوله", "نشت آب"], Icon: BurstPipeIcon },
  { keywords: ["برف", "یخبندان", "ذوب"], Icon: SnowIcon },
  { keywords: ["هواپیما", "سقوط"], Icon: PlaneCrashIcon },
  { keywords: ["برخورد", "تصادف", "وسایل نقلیه"], Icon: CollisionIcon },
  { keywords: ["شکست شیشه"], Icon: GlassBreakIcon },
  { keywords: ["ریزش", "رانش", "فروکش زمین"], Icon: LandslideIcon },
  { keywords: ["نشت گاز", "مواد شیمیایی"], Icon: GasLeakIcon },
  { keywords: ["سنگینی برف", "تگرگ"], Icon: HailIcon },
  { keywords: ["اثاثیه", "اموال داخل"], Icon: FurnitureIcon },
  { keywords: ["تخریب", "پاکسازی", "بازسازی"], Icon: DemolitionIcon },
  { keywords: ["کارشناسی", "ارزیابی", "مدرک", "مدارک"], Icon: DocumentIcon },
  { keywords: ["سرقت", "دزدی", "خرابکاری"], Icon: TheftIcon },
  { keywords: ["شکست ماشین‌آلات", "شکست ماشین آلات"], Icon: MachineBreakIcon },
  { keywords: ["هزینه پزشکی", "درمان", "جبران هزینه‌های پزشکی"], Icon: MedicalIcon },
  { keywords: ["مسئولیت", "کارشناسی و دادرسی", "دادرسی"], Icon: StaffCostIcon },
  { keywords: ["بازسازی", "نوسازی"], Icon: RenovationIcon },
];

export function CoverageIcon({ label, className }: { label: string; className?: string }) {
  const match = KEYWORD_ICON_MAP.find((entry) => entry.keywords.some((kw) => label.includes(kw)));
  const Icon = match?.Icon ?? ExtraCoverageIcon;
  return <Icon className={className ?? "h-7 w-7 text-navy-700"} />;
}
