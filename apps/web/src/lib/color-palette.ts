/**
 * از یک رنگ پایه (hex)، یک پالت ۵۰ تا ۹۰۰ (مثل پالت‌های Tailwind) می‌سازد.
 * روی سرور اجرا می‌شود و به‌صورت CSS variable در layout تزریق می‌شود؛ به همین دلیل
 * تغییر رنگ نیازی به build/دیپلوی مجدد ندارد.
 */

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean.length === 3 ? clean.replace(/./g, (c) => c + c) : clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

// درصد میزان روشنی هر پله نسبت به پله ۵۰۰ (که همان رنگ پایه کاربر است)
const LIGHTNESS_BY_SHADE: Record<string, number> = {
  "50": 95,
  "100": 88,
  "200": 76,
  "300": 63,
  "400": 50,
  "500": -1, // پله پایه — از رنگ اصلی کاربر گرفته می‌شود
  "600": -12,
  "700": -24,
  "800": -36,
  "900": -46,
};

export function generatePaletteRgbString(baseHex: string): Record<string, string> {
  const [r, g, b] = hexToRgb(baseHex);
  const [h, s, baseL] = rgbToHsl(r, g, b);

  const result: Record<string, string> = {};
  for (const [shade, value] of Object.entries(LIGHTNESS_BY_SHADE)) {
    let lightness: number;
    if (value === -1) {
      lightness = baseL;
    } else if (value > 0) {
      // پله‌های روشن‌تر (۵۰ تا ۴۰۰): درصد ثابت روشنی مطلق
      lightness = value;
    } else {
      // پله‌های تیره‌تر (۶۰۰ تا ۹۰۰): کم کردن نسبت به پایه
      lightness = Math.max(5, baseL + value);
    }
    const [sr, sg, sb] = hslToRgb(h, s, lightness);
    result[shade] = `${sr} ${sg} ${sb}`; // فرمت "r g b" برای rgb(var(--x) / <alpha-value>)
  }
  return result;
}
