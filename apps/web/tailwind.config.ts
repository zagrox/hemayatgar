import type { Config } from "tailwindcss";

// هر پله رنگی به یک CSS variable وصل است (مثلاً --navy-500: "31 69 115")
// که در RootLayout از تنظیمات دیتابیس محاسبه و به‌صورت inline style تزریق می‌شود.
// همین باعث می‌شود تغییر رنگ از پنل/دستیار هوش مصنوعی نیازی به build مجدد نداشته باشد.
function cssVarColor(name: string) {
  return {
    50: `rgb(var(--${name}-50) / <alpha-value>)`,
    100: `rgb(var(--${name}-100) / <alpha-value>)`,
    200: `rgb(var(--${name}-200) / <alpha-value>)`,
    300: `rgb(var(--${name}-300) / <alpha-value>)`,
    400: `rgb(var(--${name}-400) / <alpha-value>)`,
    500: `rgb(var(--${name}-500) / <alpha-value>)`,
    600: `rgb(var(--${name}-600) / <alpha-value>)`,
    700: `rgb(var(--${name}-700) / <alpha-value>)`,
    800: `rgb(var(--${name}-800) / <alpha-value>)`,
    900: `rgb(var(--${name}-900) / <alpha-value>)`,
  };
}

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        vazir: ["var(--font-active)", "Tahoma", "sans-serif"],
      },
      borderRadius: {
        card: "var(--radius-card, 1rem)",
        btn: "var(--radius-btn, 0.75rem)",
      },
      colors: {
        navy: cssVarColor("navy"),
        orange: cssVarColor("orange"),
      },
    },
  },
  plugins: [],
};

export default config;
