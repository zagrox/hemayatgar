import cron from "node-cron";
import { prisma } from "@hemayatgar/database";
import { runAiAssistant } from "../services/ai-assistant.service";
import { isAiEnabled } from "../config/ai";
import { logger } from "../config/logger";

const WEEKLY_ARTICLE_PROMPT =
  "یک مقاله جدید و آموزنده برای وبلاگ سایت درباره یکی از رشته‌های بیمه ایران بنویس " +
  "(بیمه خودرو، مسئولیت، آتش‌سوزی، اشخاص، مهندسی، حمل‌ونقل یا انرژی). قبل از نوشتن، فهرست " +
  "مقالات موجود را چک کن تا موضوع تکراری نباشد. مقاله باید حدود ۴۰۰ تا ۶۰۰ کلمه، سئو-دوست و " +
  "منتشرشده (publish: true) باشد.";

/**
 * این وظیفه فقط وقتی فعال می‌شود که هم ANTHROPIC_API_KEY تنظیم شده باشد
 * و هم ENABLE_AI_WEEKLY_ARTICLE=true در .env قرار داده شده باشد.
 * پیش‌فرض پروژه غیرفعال است تا هیچ هزینه یا تغییر محتوایی بدون تأیید صریح رخ ندهد.
 */
export function scheduleWeeklyArticleJob() {
  const isEnabled = process.env.ENABLE_AI_WEEKLY_ARTICLE === "true";
  if (!isEnabled || !isAiEnabled) {
    logger.info("زمان‌بند مقاله هفتگی هوش مصنوعی غیرفعال است");
    return;
  }

  const cronExpression = process.env.AI_WEEKLY_ARTICLE_CRON ?? "0 9 * * 6"; // پیش‌فرض: شنبه ساعت ۹ صبح

  cron.schedule(cronExpression, async () => {
    logger.info("در حال اجرای وظیفه هفتگی نوشتن مقاله با هوش مصنوعی...");
    try {
      const superAdmin = await prisma.adminUser.findFirst({
        where: { role: { name: "SUPER_ADMIN" }, isActive: true },
      });
      if (!superAdmin) {
        logger.error("هیچ کاربر مدیر کل فعالی برای اجرای وظیفه هفتگی یافت نشد");
        return;
      }
      const result = await runAiAssistant([], WEEKLY_ARTICLE_PROMPT, superAdmin.id);
      logger.info({ actions: result.actionsPerformed }, "وظیفه هفتگی مقاله با موفقیت اجرا شد");
    } catch (error) {
      logger.error({ err: error }, "خطا در اجرای وظیفه هفتگی مقاله");
    }
  });

  logger.info(`زمان‌بند مقاله هفتگی فعال شد (cron: ${cronExpression})`);
}
