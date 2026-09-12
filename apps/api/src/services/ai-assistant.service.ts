import Anthropic from "@anthropic-ai/sdk";
import { anthropic, isAiEnabled, AI_MODEL } from "../config/ai";
import { AI_TOOLS, executeAiTool } from "./ai-tools.service";
import { logger } from "../config/logger";

export class AiNotConfiguredError extends Error {
  constructor() {
    super("دستیار هوش مصنوعی هنوز پیکربندی نشده است (ANTHROPIC_API_KEY تنظیم نشده)");
    this.name = "AiNotConfiguredError";
  }
}

const SYSTEM_PROMPT = `تو دستیار محتوای سایت «حمایتگر» (نمایندگی رسمی بیمه ایران، کد ۹۹۶۸) هستی.
با ابزارهایی که در اختیار داری می‌توانی مقاله بنویسی/ویرایش کنی، محتوای رشته‌های بیمه و صفحات
ثابت را ویرایش کنی، و تصاویری که کاربر پیوست می‌کند را جایگزین کنی.

قوانین مهم:
- همیشه لحن حرفه‌ای و رسمی فارسی، مناسب صنعت بیمه.
- قبل از نوشتن مقاله جدید، با list_articles چک کن که موضوع تکراری نباشد.
- محتوای HTML ساده (پاراگراف، تیتر) بنویس، نه Markdown.
- برای فیلدهای پوشش‌ها/موارد استثناء/مزایای زیررشته‌های بیمه، **هر مورد را در یک خط جدا** بنویس
  (نه یک پاراگراف پیوسته)، چون هرخط در سایت به‌صورت یک آیکون+کارت مجزا نمایش داده می‌شود. مثلاً:
  "آتش‌سوزی\nانفجار\nصاعقه\nسیل و طغیان رودخانه" — هر خط کوتاه و ۲ تا ۴ کلمه باشد.
- در پایان هر اقدام، خلاصه‌ای کوتاه و فارسی از کاری که انجام دادی به کاربر بگو.
- قبل از اجرای update_request_status، update_site_settings، یا هر ابزار delete_*، اگر درخواست
  کاربر کاملاً روشن و صریح نبود، اول از او تأیید بگیر و بعد اجرا کن.
- ابزارهای حذف (delete_article, delete_slider_item, delete_media_file, delete_page_section)
  برگشت‌ناپذیرند؛ همیشه قبل از اجرا نام دقیق موردی که حذف می‌شود را به کاربر بگو.
- برای اضافه/حذف/جابه‌جایی یک «بخش/سکشن» کامل روی یک صفحه (نه فقط ویرایش متن)، از ابزارهای
  list_page_sections / add_page_section / update_page_section / delete_page_section /
  reorder_page_sections استفاده کن. pageSlug صفحه اصلی همیشه "home" است؛ برای صفحه هر رشته بیمه
  pageSlug به‌صورت "insurance-{slug}" است (مثلاً برای بیمه خودرو: "insurance-car")؛ برای صفحه
  یک مقاله خاص pageSlug به‌صورت "article-{slug}" است.
- برای تغییر رنگ یا فونت کل سایت از update_site_theme استفاده کن؛ نیازی به تأیید انسانی نیست
  چون این تغییر همیشه قابل برگشت است.
- ابزار set_image حالا لوگو، فاوآیکون، هر دو عکس هیرو صفحه اصلی، آیکون هر رشته بیمه، تصویر شاخص
  رشته بیمه، کاور مقاله و اسلایدر را پوشش می‌دهد؛ همیشه از پیام سیستم بفهم دقیقاً کدام تصویر
  پیوست شده و کاربر کجا می‌خواهد قرارش دهد.
- اگر کاربر یک عکس از یک طرح/صفحه بفرستد و بخواهد آن را "کدنویسی کنی و به سایت اضافه کنی"، تو
  واقعاً تصویر را می‌بینی (توانایی vision داری). طرح را با دقت تحلیل کن و یک یا چند بخش با
  add_page_section از نوع CUSTOM_HTML بساز که ساختار و چیدمان طرح را با HTML و **inline style**
  (نه کلاس Tailwind، چون کلاس‌های Tailwind برای محتوای دیتابیسی کامپایل نمی‌شوند و بی‌اثرند)
  بازسازی کند. رنگ‌ها را نزدیک به پالت رنگی فعلی سایت (update_site_theme) انتخاب کن مگر کاربر
  رنگ دیگری خواسته باشد.
- قبل از add_page_section حتماً اول list_page_sections را بزن تا بفهمی صفحه چه ساختاری دارد و
  سکشن تکراری اضافه نکنی.`;

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiChatResult {
  reply: string;
  actionsPerformed: { tool: string; result: unknown }[];
}

export async function runAiAssistant(
  history: AiChatMessage[],
  userMessage: string,
  adminUserId: string,
  attachedImage?: { base64: string; mediaType: string },
): Promise<AiChatResult> {
  if (!isAiEnabled || !anthropic) {
    throw new AiNotConfiguredError();
  }

  const userContent: Anthropic.MessageParam["content"] = attachedImage
    ? [
        {
          type: "image",
          source: { type: "base64", media_type: attachedImage.mediaType as "image/jpeg" | "image/png" | "image/webp", data: attachedImage.base64 },
        },
        { type: "text", text: userMessage },
      ]
    : userMessage;

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({ role: m.role, content: m.content }) as Anthropic.MessageParam),
    { role: "user", content: userContent },
  ];

  const actionsPerformed: { tool: string; result: unknown }[] = [];
  let finalText = "";

  // حداکثر ۶ دور رفت‌وبرگشت برای جلوگیری از حلقه بی‌پایان ابزارها
  for (let turn = 0; turn < 6; turn++) {
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      tools: AI_TOOLS,
      messages,
    });

    const toolUseBlocks = response.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
    );
    const textBlocks = response.content.filter(
      (block): block is Anthropic.TextBlock => block.type === "text",
    );
    finalText = textBlocks.map((b) => b.text).join("\n") || finalText;

    if (toolUseBlocks.length === 0) {
      break;
    }

    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const toolUse of toolUseBlocks) {
      logger.info({ tool: toolUse.name, input: toolUse.input }, "ai_tool_call");
      const result = await executeAiTool(toolUse.name, toolUse.input as Record<string, unknown>, {
        adminUserId,
      });
      actionsPerformed.push({ tool: toolUse.name, result });
      toolResults.push({
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: JSON.stringify(result),
      });
    }

    messages.push({ role: "user", content: toolResults });
  }

  return { reply: finalText || "انجام شد.", actionsPerformed };
}
