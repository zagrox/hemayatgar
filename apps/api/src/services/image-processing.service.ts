import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";
import { UPLOAD_DIR } from "../config/upload";
import { logger } from "../config/logger";

/**
 * هر محل استفاده از عکس در سایت، ابعاد استاندارد و دقیق خودش را دارد تا هیچ‌وقت
 * عکس کش نیاد یا نامتناسب دیده نشه. همه‌ی قالب‌ها با fit=contain هستند یعنی
 * **کل عکس بدون هیچ برشی** داخل قاب جا می‌شود (در صورت نیاز با حاشیه سفید/شفاف).
 */
export type ImageTarget =
  | "site_logo"
  | "site_favicon"
  | "homepage_hero"
  | "homepage_hero_secondary"
  | "insurance_category_icon"
  | "insurance_category_hero"
  | "insurance_subsection_image"
  | "article_cover"
  | "slider_item";

interface ImagePreset {
  width: number;
  height: number;
  fit: keyof sharp.FitEnum; // همیشه "contain" — کل عکس بدون برش داخل قاب جا می‌شود
  background?: sharp.Color; // رنگ حاشیه خالی اطراف عکس
  format: "webp" | "png";
}

const TRANSPARENT = { r: 255, g: 255, b: 255, alpha: 0 };

/**
 * همه قالب‌ها با پس‌زمینه **شفاف** و فرمت PNG هستند تا عکس‌های سه‌بعدی پریمیوم
 * (که معمولاً PNG با پس‌زمینه شفاف‌اند) شفافیت خود را از دست ندهند و
 * مستطیل سفید دورشان نیفتد.
 */
const IMAGE_PRESETS: Record<ImageTarget, ImagePreset> = {
  site_logo: { width: 256, height: 256, fit: "contain", background: TRANSPARENT, format: "png" },
  site_favicon: { width: 64, height: 64, fit: "contain", background: TRANSPARENT, format: "png" },
  homepage_hero: { width: 1400, height: 900, fit: "contain", background: TRANSPARENT, format: "png" },
  homepage_hero_secondary: { width: 1000, height: 900, fit: "contain", background: TRANSPARENT, format: "png" },
  insurance_category_icon: { width: 256, height: 256, fit: "contain", background: TRANSPARENT, format: "png" },
  insurance_category_hero: { width: 1400, height: 800, fit: "contain", background: TRANSPARENT, format: "png" },
  insurance_subsection_image: { width: 900, height: 700, fit: "contain", background: TRANSPARENT, format: "png" },
  article_cover: { width: 1200, height: 630, fit: "contain", background: TRANSPARENT, format: "png" },
  slider_item: { width: 1600, height: 600, fit: "contain", background: TRANSPARENT, format: "png" },
};

/**
 * یک تصویر آپلودشده (با آدرس نسبی /uploads/...) را می‌گیرد، دقیقاً مطابق قالب هدف
 * ریسایز/کراپ می‌کند، و آدرس نسخه جدید را برمی‌گرداند. اگر ورودی از سرور ما نباشد
 * (مثلاً یک URL خارجی)، بدون تغییر همان را برمی‌گرداند — چون فایل فیزیکی در دسترس نیست.
 */
export async function processImageForTarget(imageUrl: string, target: ImageTarget): Promise<string> {
  if (!imageUrl.startsWith("/uploads/")) {
    // آدرس خارجی است؛ امکان پردازش سمت سرور خودمان وجود ندارد
    return imageUrl;
  }

  const preset = IMAGE_PRESETS[target];
  const sourceFilename = imageUrl.replace("/uploads/", "");
  const sourcePath = path.join(UPLOAD_DIR, sourceFilename);

  if (!fs.existsSync(sourcePath)) {
    logger.warn({ sourcePath }, "فایل مبدأ برای پردازش تصویر یافت نشد");
    return imageUrl;
  }

  const outputFilename = `${path.parse(sourceFilename).name}-${target}-${Date.now()}.${preset.format}`;
  const outputPath = path.join(UPLOAD_DIR, outputFilename);

  let pipeline = sharp(sourcePath).resize({
    width: preset.width,
    height: preset.height,
    fit: preset.fit,
    background: preset.background,
  });

  // PNG با فشرده‌سازی بهینه — شفافیت و کیفیت عکس‌های سه‌بعدی حفظ می‌شود
  // اما حجم فایل تا حد ممکن کم می‌شود تا سرعت سایت پایین نیاید
  pipeline =
    preset.format === "webp"
      ? pipeline.webp({ quality: 90 })
      : pipeline.png({ compressionLevel: 9, palette: true, quality: 90 });

  await pipeline.toFile(outputPath);

  logger.info({ target, outputFilename }, "تصویر با موفقیت برای این محل پردازش شد");
  return `/uploads/${outputFilename}`;
}

export { IMAGE_PRESETS };
