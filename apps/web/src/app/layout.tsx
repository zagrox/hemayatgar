import type { Metadata } from "next";
import { Vazirmatn, Noto_Naskh_Arabic } from "next/font/google";
import "@/styles/globals.css";
import { generatePaletteRgbString } from "@/lib/color-palette";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto",
  display: "swap",
});

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface LiveTheme {
  primaryColorHex: string;
  accentColorHex: string;
  fontFamily: "vazirmatn" | "noto";
  borderRadiusStyle: "sharp" | "rounded" | "pill";
  logoUrl: string | null;
  faviconUrl: string | null;
  googleAnalyticsId: string | null;
}

async function getLiveTheme(): Promise<LiveTheme> {
  try {
    const res = await fetch(`${API_URL}/api/site-theme`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("theme fetch failed");
    return res.json();
  } catch {
    return {
      primaryColorHex: "#1F4573",
      accentColorHex: "#F5720F",
      fontFamily: "vazirmatn",
      borderRadiusStyle: "rounded",
      logoUrl: null,
      faviconUrl: null,
      googleAnalyticsId: null,
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getLiveTheme();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: "حمایتگر | نمایندگی بیمه ایران - کد ۹۹۶۸",
      template: "%s | حمایتگر",
    },
    description:
      "شرکت خدمات بیمه‌ای حمایتگر، نمایندگی رسمی بیمه ایران. مشاوره تخصصی و ثبت درخواست بیمه خودرو، مسئولیت، آتش‌سوزی، اشخاص، مهندسی، حمل‌ونقل و انرژی.",
    robots: { index: true, follow: true },
    icons: theme.faviconUrl ? { icon: theme.faviconUrl } : undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getLiveTheme();
  const navyPalette = generatePaletteRgbString(theme.primaryColorHex);
  const orangePalette = generatePaletteRgbString(theme.accentColorHex);
  const activeFontVar = theme.fontFamily === "noto" ? "var(--font-noto)" : "var(--font-vazirmatn)";

  const RADIUS_STYLES = {
    sharp: { card: "0.25rem", btn: "0.25rem" },
    rounded: { card: "1rem", btn: "0.75rem" },
    pill: { card: "1.5rem", btn: "9999px" },
  } as const;
  const radius = RADIUS_STYLES[theme.borderRadiusStyle] ?? RADIUS_STYLES.rounded;

  const cssVars = [
    ...Object.entries(navyPalette).map(([shade, rgb]) => `--navy-${shade}: ${rgb};`),
    ...Object.entries(orangePalette).map(([shade, rgb]) => `--orange-${shade}: ${rgb};`),
    `--font-active: ${activeFontVar};`,
    `--radius-card: ${radius.card};`,
    `--radius-btn: ${radius.btn};`,
  ].join(" ");

  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${notoNaskh.variable}`}>
      <head>
        {/* رنگ‌ها و فونت فعال — از تنظیمات دیتابیس، بدون نیاز به build مجدد */}
        <style dangerouslySetInnerHTML={{ __html: `:root { ${cssVars} }` }} />
        {theme.googleAnalyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${theme.googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${theme.googleAnalyticsId}');`,
              }}
            />
          </>
        )}
      </head>
      <body className="font-vazir bg-white text-navy-900 antialiased">{children}</body>
    </html>
  );
}
