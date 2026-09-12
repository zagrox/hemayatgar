import type Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@hemayatgar/database";
import { createArticle, updateArticle, listArticles } from "./article.service";
import { updatePage, getPageBySlug } from "./page.service";
import { updateInsuranceSubsection } from "./insurance-subsection.service";
import { listInsuranceCategories } from "./insurance-category.service";
import { updateInsuranceCategory } from "./insurance-category.service";
import { createSliderItem, deleteSliderItem } from "./slider.service";
import {
  listConsultationRequests,
  updateConsultationRequest,
  addRequestNote,
} from "./request.service";
import { listCustomers, addCustomerInteraction } from "./customer.service";
import { getSiteSettings, updateSiteSettings } from "./settings.service";
import { deleteMediaFile } from "./media.service";
import { processImageForTarget, type ImageTarget } from "./image-processing.service";
import {
  listPageSections,
  createPageSection,
  updatePageSection,
  deletePageSection,
  reorderPageSections,
} from "./page-section.service";

/**
 * تعریف ابزارهای در دسترس دستیار هوش مصنوعی، به فرمت مورد نیاز Anthropic tool-use.
 * هر ابزار مستقیماً به سرویس‌های همان بخش (article.service, page.service و ...) وصل است
 * تا هیچ منطق تکراری ساخته نشود.
 */
export const AI_TOOLS: Anthropic.Tool[] = [
  {
    name: "list_articles",
    description: "فهرست مقالات موجود وبلاگ را برمی‌گرداند (برای جلوگیری از تکرار عنوان/slug).",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "create_article",
    description: "یک مقاله جدید در وبلاگ سایت می‌نویسد و ذخیره می‌کند.",
    input_schema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "نشانی یکتای انگلیسی مقاله، مثل car-insurance-tips" },
        title: { type: "string" },
        excerpt: { type: "string", description: "چکیده کوتاه یک تا دو خطی" },
        content: { type: "string", description: "متن کامل مقاله به صورت HTML ساده" },
        publish: { type: "boolean", description: "آیا بلافاصله منتشر شود؟ پیش‌فرض true" },
      },
      required: ["slug", "title", "content"],
    },
  },
  {
    name: "update_article",
    description: "یک مقاله موجود وبلاگ را ویرایش می‌کند (با slug مشخص می‌شود).",
    input_schema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        title: { type: "string" },
        excerpt: { type: "string" },
        content: { type: "string" },
        publish: { type: "boolean" },
      },
      required: ["slug"],
    },
  },
  {
    name: "list_insurance_categories",
    description: "فهرست رشته‌های بیمه و زیررشته‌های هرکدام را برمی‌گرداند.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "update_insurance_subsection_content",
    description:
      "محتوای یک زیررشته بیمه (معرفی/پوشش‌ها/استثناء/مزایا) را ویرایش می‌کند و/یا صفحه مستقل " +
      "برایش فعال یا غیرفعال می‌کند. وقتی isStandalonePage=true شود، آدرس مستقل " +
      "/insurance/{categorySlug}/{subsectionSlug} برای آن زیررشته زنده می‌شود (بدون نیاز به کد جدید).",
    input_schema: {
      type: "object",
      properties: {
        categorySlug: { type: "string" },
        subsectionSlug: { type: "string" },
        introduction: { type: "string" },
        coverages: { type: "string" },
        exclusions: { type: "string" },
        benefits: { type: "string" },
        isStandalonePage: { type: "boolean" },
      },
      required: ["categorySlug", "subsectionSlug"],
    },
  },
  {
    name: "get_static_page",
    description: "محتوای فعلی یک صفحه ثابت (about-us, contact-us, cooperation) را می‌خواند.",
    input_schema: {
      type: "object",
      properties: { slug: { type: "string" } },
      required: ["slug"],
    },
  },
  {
    name: "update_static_page_content",
    description: "محتوای یک صفحه ثابت (درباره ما، تماس با ما، همکاری با ما) را ویرایش می‌کند.",
    input_schema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        content: { type: "string", description: "HTML جدید صفحه" },
      },
      required: ["slug", "content"],
    },
  },
  {
    name: "set_image",
    description:
      "یک تصویری که کاربر همین الان در چت پیوست کرده را روی هر بخشی از سایت جایگزین می‌کند — " +
      "لوگو، فاوآیکون، عکس‌های هیرو صفحه اصلی، آیکون رشته بیمه، تصویر شاخص رشته بیمه، کاور مقاله، یا اسلایدر. " +
      "آدرس تصویر (imageUrl) را از پیام سیستم که آدرس تصویر پیوست‌شده را اعلام کرده بردار.",
    input_schema: {
      type: "object",
      properties: {
        target: {
          type: "string",
          enum: [
            "site_logo",
            "site_favicon",
            "homepage_hero",
            "homepage_hero_secondary",
            "insurance_category_icon",
            "insurance_subsection_image",
            "insurance_category_hero",
            "article_cover",
            "new_slider_item",
          ],
        },
        targetSlug: {
          type: "string",
          description:
            "slug رشته بیمه، مقاله، یا زیررشته؛ برای site_logo, site_favicon, homepage_hero, homepage_hero_secondary, new_slider_item لازم نیست",
        },
        categorySlug: {
          type: "string",
          description: "فقط برای insurance_subsection_image لازم است — slug رشته بیمه‌ای که این زیررشته زیرمجموعه آن است",
        },
        imageUrl: { type: "string" },
        title: { type: "string", description: "فقط برای new_slider_item لازم است" },
      },
      required: ["target", "imageUrl"],
    },
  },
  {
    name: "list_requests",
    description: "فهرست درخواست‌های مشاوره را برمی‌گرداند (می‌توان بر اساس وضعیت فیلتر کرد).",
    input_schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["NEW", "IN_PROGRESS", "CONTACTED", "CONVERTED", "CLOSED"],
        },
      },
    },
  },
  {
    name: "update_request_status",
    description: "وضعیت یک درخواست مشاوره را تغییر می‌دهد (id از list_requests گرفته می‌شود).",
    input_schema: {
      type: "object",
      properties: {
        requestId: { type: "string" },
        status: {
          type: "string",
          enum: ["NEW", "IN_PROGRESS", "CONTACTED", "CONVERTED", "CLOSED"],
        },
      },
      required: ["requestId", "status"],
    },
  },
  {
    name: "add_request_note",
    description: "یک یادداشت داخلی به یک درخواست مشاوره اضافه می‌کند.",
    input_schema: {
      type: "object",
      properties: {
        requestId: { type: "string" },
        note: { type: "string" },
      },
      required: ["requestId", "note"],
    },
  },
  {
    name: "list_customers",
    description: "فهرست مشتریان را برمی‌گرداند (می‌توان با نام/موبایل جستجو کرد).",
    input_schema: {
      type: "object",
      properties: { search: { type: "string" } },
    },
  },
  {
    name: "add_customer_interaction",
    description: "یک سابقه ارتباط (تماس، جلسه و ...) برای یک مشتری ثبت می‌کند.",
    input_schema: {
      type: "object",
      properties: {
        customerId: { type: "string" },
        type: { type: "string", enum: ["CALL", "MEETING", "WHATSAPP", "NOTE", "OTHER"] },
        description: { type: "string" },
      },
      required: ["customerId", "type", "description"],
    },
  },
  {
    name: "get_site_settings",
    description: "تنظیمات فعلی سایت (اطلاعات تماس، شبکه‌های اجتماعی، عنوان و توضیحات پیش‌فرض سئو) را می‌خواند.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "update_site_settings",
    description: "تنظیمات سایت را ویرایش می‌کند (فقط فیلدهایی که مقدار می‌دهی تغییر می‌کنند).",
    input_schema: {
      type: "object",
      properties: {
        siteName: { type: "string" },
        siteTagline: { type: "string" },
        phone: { type: "string" },
        mobile: { type: "string" },
        email: { type: "string" },
        address: { type: "string" },
        workingHours: { type: "string" },
        instagramUrl: { type: "string" },
        telegramUrl: { type: "string" },
        whatsappUrl: { type: "string" },
        baleUrl: { type: "string" },
        rubikaUrl: { type: "string" },
        defaultSeoTitle: { type: "string" },
        defaultSeoDescription: { type: "string" },
        statSatisfiedCustomers: { type: "string", description: "مثل '+5,000' برای صفحه درباره ما" },
        statPoliciesIssued: { type: "string" },
        statYearsExperience: { type: "string" },
      },
    },
  },
  {
    name: "delete_article",
    description: "یک مقاله را برای همیشه حذف می‌کند. قبل از حذف حتماً از کاربر تأیید بگیر.",
    input_schema: {
      type: "object",
      properties: { slug: { type: "string" } },
      required: ["slug"],
    },
  },
  {
    name: "delete_slider_item",
    description: "یک اسلاید از اسلایدر صفحه اصلی حذف می‌کند.",
    input_schema: {
      type: "object",
      properties: { sliderItemId: { type: "string" } },
      required: ["sliderItemId"],
    },
  },
  {
    name: "delete_media_file",
    description: "یک فایل از کتابخانه تصاویر حذف می‌کند.",
    input_schema: {
      type: "object",
      properties: { mediaFileId: { type: "string" } },
      required: ["mediaFileId"],
    },
  },
  {
    name: "list_page_sections",
    description: "فهرست بلاک‌های (سکشن‌های) فعلی یک صفحه را برمی‌گرداند (pageSlug: 'home' برای صفحه اصلی، یا slug صفحه ثابت مثل about-us).",
    input_schema: {
      type: "object",
      properties: { pageSlug: { type: "string" } },
      required: ["pageSlug"],
    },
  },
  {
    name: "add_page_section",
    description:
      "یک بخش/سکشن کاملاً جدید به یک صفحه اضافه می‌کند — مثل اضافه کردن یک بخش تازه به سایت بدون نیاز به تغییر کد. " +
      "انواع مجاز: HERO (تیتر بزرگ+زیرتیتر+دکمه+عکس)، TEXT_IMAGE (متن+عکس)، FEATURE_GRID (گرید چند آیتم با عنوان/توضیح/آیکون)، " +
      "TESTIMONIALS (نظرات مشتریان)، CTA_BANNER (نوار دعوت به اقدام)، IMAGE_GALLERY (گالری چند عکس)، " +
      "CUSTOM_HTML (برای هر محتوای دلخواه دیگر که در قالب‌های بالا نمی‌گنجد، یک HTML ساده بنویس).",
    input_schema: {
      type: "object",
      properties: {
        pageSlug: { type: "string" },
        type: {
          type: "string",
          enum: [
            "HERO",
            "TEXT_IMAGE",
            "FEATURE_GRID",
            "TESTIMONIALS",
            "CTA_BANNER",
            "IMAGE_GALLERY",
            "CUSTOM_HTML",
          ],
        },
        content: {
          type: "object",
          description:
            "ساختار بسته به type فرق دارد. HERO: {title, subtitle, ctaText, ctaLink, imageUrl}. " +
            "TEXT_IMAGE: {title, text, imageUrl, imagePosition:'left'|'right'}. " +
            "FEATURE_GRID: {title, items:[{title, description}]}. " +
            "TESTIMONIALS: {items:[{name, text}]}. CTA_BANNER: {title, subtitle, buttonText, buttonLink}. " +
            "IMAGE_GALLERY: {images:[url,...]}. CUSTOM_HTML: {html}.",
        },
        order: { type: "number", description: "ترتیب نمایش؛ اگر ندهی، آخر صفحه اضافه می‌شود" },
      },
      required: ["pageSlug", "type", "content"],
    },
  },
  {
    name: "update_page_section",
    description: "محتوای یک بلاک موجود را ویرایش می‌کند (id از list_page_sections گرفته می‌شود).",
    input_schema: {
      type: "object",
      properties: {
        sectionId: { type: "string" },
        content: { type: "object" },
        isActive: { type: "boolean", description: "false = مخفی کردن بدون حذف کامل" },
      },
      required: ["sectionId"],
    },
  },
  {
    name: "delete_page_section",
    description: "یک بخش/سکشن را کامل از صفحه حذف می‌کند (برگشت‌ناپذیر — قبلش تأیید بگیر).",
    input_schema: {
      type: "object",
      properties: { sectionId: { type: "string" } },
      required: ["sectionId"],
    },
  },
  {
    name: "reorder_page_sections",
    description: "ترتیب نمایش بخش‌های یک صفحه را تغییر می‌دهد.",
    input_schema: {
      type: "object",
      properties: {
        pageSlug: { type: "string" },
        orderedSectionIds: { type: "array", items: { type: "string" } },
      },
      required: ["pageSlug", "orderedSectionIds"],
    },
  },
  {
    name: "update_site_theme",
    description:
      "رنگ اصلی (سرمه‌ای) یا رنگ تاکیدی (نارنجی) یا فونت کل سایت را تغییر می‌دهد — تغییر فوری و " +
      "بدون نیاز به دیپلوی مجدد است. رنگ باید کد hex باشد (مثل #1F4573). اگر کاربر اسم رنگ گفت " +
      "(مثلاً 'سبز')، خودت آن را به نزدیک‌ترین کد hex مناسب و خوانا تبدیل کن.",
    input_schema: {
      type: "object",
      properties: {
        primaryColorHex: { type: "string", description: "رنگ اصلی سایت، مثل هدر و دکمه‌های اصلی" },
        accentColorHex: { type: "string", description: "رنگ تاکیدی، مثل دکمه‌های CTA" },
        fontFamily: { type: "string", enum: ["vazirmatn", "noto"] },
      },
    },
  },
];

export async function executeAiTool(
  toolName: string,
  input: Record<string, unknown>,
  context: { adminUserId: string },
): Promise<unknown> {
  switch (toolName) {
    case "list_articles":
      return (await listArticles()).map((a) => ({ slug: a.slug, title: a.title, status: a.status }));

    case "create_article":
      return createArticle({
        slug: input.slug as string,
        title: input.title as string,
        excerpt: input.excerpt as string | undefined,
        content: input.content as string,
      }).then(async (article) => {
        if (input.publish !== false) {
          await updateArticle(article.id, { status: "PUBLISHED", publishedAt: new Date() });
        }
        return { id: article.id, slug: article.slug };
      });

    case "update_article": {
      const article = await prisma.article.findUnique({ where: { slug: input.slug as string } });
      if (!article) return { error: "مقاله‌ای با این slug یافت نشد" };
      const data: Record<string, unknown> = {};
      if (input.title) data.title = input.title;
      if (input.excerpt) data.excerpt = input.excerpt;
      if (input.content) data.content = input.content;
      if (input.publish !== undefined) {
        data.status = input.publish ? "PUBLISHED" : "DRAFT";
        if (input.publish) data.publishedAt = new Date();
      }
      await updateArticle(article.id, data);
      return { success: true };
    }

    case "list_insurance_categories":
      return (await listInsuranceCategories()).map((c) => ({
        slug: c.slug,
        title: c.title,
        subsections: c.subsections.map((s) => ({ slug: s.slug, title: s.title })),
      }));

    case "update_insurance_subsection_content": {
      const category = await prisma.insuranceCategory.findUnique({
        where: { slug: input.categorySlug as string },
      });
      if (!category) return { error: "رشته بیمه یافت نشد" };
      const subsection = await prisma.insuranceSubsection.findUnique({
        where: {
          categoryId_slug: { categoryId: category.id, slug: input.subsectionSlug as string },
        },
      });
      if (!subsection) return { error: "زیررشته یافت نشد" };
      await updateInsuranceSubsection(subsection.id, {
        introduction: input.introduction as string | undefined,
        coverages: input.coverages as string | undefined,
        exclusions: input.exclusions as string | undefined,
        benefits: input.benefits as string | undefined,
        isStandalonePage: input.isStandalonePage as boolean | undefined,
      });
      return { success: true };
    }

    case "get_static_page": {
      const page = await getPageBySlug(input.slug as string);
      return page ? { title: page.title, content: page.content } : { error: "صفحه یافت نشد" };
    }

    case "update_static_page_content": {
      const page = await getPageBySlug(input.slug as string);
      if (!page) return { error: "صفحه یافت نشد" };
      await updatePage(page.id, { content: input.content as string });
      return { success: true };
    }

    case "set_image": {
      const target = input.target as string;
      const rawImageUrl = input.imageUrl as string;

      // نگاشت نام target ابزار به نام preset پردازش تصویر (اسم‌ها یکی نیستند)
      const presetMap: Record<string, ImageTarget> = {
        site_logo: "site_logo",
        site_favicon: "site_favicon",
        homepage_hero: "homepage_hero",
        homepage_hero_secondary: "homepage_hero_secondary",
        insurance_category_icon: "insurance_category_icon",
        insurance_subsection_image: "insurance_subsection_image",
        insurance_category_hero: "insurance_category_hero",
        article_cover: "article_cover",
        new_slider_item: "slider_item",
      };
      const preset = presetMap[target];
      const imageUrl = preset ? await processImageForTarget(rawImageUrl, preset) : rawImageUrl;

      if (target === "site_logo") {
        await updateSiteSettings({ logoUrl: imageUrl });
        return { success: true };
      }

      if (target === "site_favicon") {
        await updateSiteSettings({ faviconUrl: imageUrl });
        return { success: true };
      }

      if (target === "homepage_hero") {
        await updateSiteSettings({ heroImageUrl: imageUrl });
        return { success: true };
      }

      if (target === "homepage_hero_secondary") {
        await updateSiteSettings({ heroSecondaryImageUrl: imageUrl });
        return { success: true };
      }

      if (target === "insurance_category_icon") {
        const category = await prisma.insuranceCategory.findUnique({
          where: { slug: input.targetSlug as string },
        });
        if (!category) return { error: "رشته بیمه یافت نشد" };
        await updateInsuranceCategory(category.id, { icon: imageUrl });
        return { success: true };
      }

      if (target === "insurance_subsection_image") {
        const category = await prisma.insuranceCategory.findUnique({
          where: { slug: input.categorySlug as string },
        });
        if (!category) return { error: "رشته بیمه یافت نشد (categorySlug را بررسی کن)" };
        const subsection = await prisma.insuranceSubsection.findUnique({
          where: { categoryId_slug: { categoryId: category.id, slug: input.targetSlug as string } },
        });
        if (!subsection) return { error: "زیررشته یافت نشد" };
        await updateInsuranceSubsection(subsection.id, { imageUrl });
        return { success: true };
      }

      if (target === "insurance_category_hero") {
        const category = await prisma.insuranceCategory.findUnique({
          where: { slug: input.targetSlug as string },
        });
        if (!category) return { error: "رشته بیمه یافت نشد" };
        await updateInsuranceCategory(category.id, { heroImageUrl: imageUrl });
        return { success: true };
      }

      if (target === "article_cover") {
        const article = await prisma.article.findUnique({
          where: { slug: input.targetSlug as string },
        });
        if (!article) return { error: "مقاله یافت نشد" };
        await updateArticle(article.id, { coverImageUrl: imageUrl });
        return { success: true };
      }

      if (target === "new_slider_item") {
        const item = await createSliderItem({
          title: (input.title as string) ?? "اسلاید جدید",
          imageUrl,
        });
        return { success: true, id: item.id };
      }

      return { error: "نوع target نامعتبر است" };
    }

    case "list_requests": {
      const status = input.status as
        | "NEW"
        | "IN_PROGRESS"
        | "CONTACTED"
        | "CONVERTED"
        | "CLOSED"
        | undefined;
      const requests = await listConsultationRequests(status ? { status } : undefined);
      return requests.map((r) => ({
        id: r.id,
        fullName: r.fullName,
        mobile: r.mobile,
        status: r.status,
        insuranceCategory: r.insuranceCategory?.title ?? null,
        createdAt: r.createdAt,
      }));
    }

    case "update_request_status": {
      await updateConsultationRequest(input.requestId as string, {
        status: input.status as "NEW" | "IN_PROGRESS" | "CONTACTED" | "CONVERTED" | "CLOSED",
      });
      return { success: true };
    }

    case "add_request_note": {
      const note = await addRequestNote(
        input.requestId as string,
        context.adminUserId,
        input.note as string,
      );
      return { success: true, noteId: note.id };
    }

    case "list_customers":
      return (await listCustomers(input.search as string | undefined)).map((c) => ({
        id: c.id,
        fullName: c.fullName,
        mobile: c.mobile,
        email: c.email,
      }));

    case "add_customer_interaction": {
      const interaction = await addCustomerInteraction(input.customerId as string, {
        type: input.type as "CALL" | "MEETING" | "WHATSAPP" | "NOTE" | "OTHER",
        description: input.description as string,
        createdById: context.adminUserId,
      });
      return { success: true, interactionId: interaction.id };
    }

    case "get_site_settings":
      return getSiteSettings();

    case "update_site_settings":
      return updateSiteSettings(input);

    case "delete_article": {
      const article = await prisma.article.findUnique({ where: { slug: input.slug as string } });
      if (!article) return { error: "مقاله یافت نشد" };
      await prisma.article.delete({ where: { id: article.id } });
      return { success: true };
    }

    case "delete_slider_item":
      await deleteSliderItem(input.sliderItemId as string);
      return { success: true };

    case "delete_media_file":
      await deleteMediaFile(input.mediaFileId as string);
      return { success: true };

    case "list_page_sections":
      return listPageSections(input.pageSlug as string);

    case "add_page_section": {
      const section = await createPageSection({
        pageSlug: input.pageSlug as string,
        type: input.type as Parameters<typeof createPageSection>[0]["type"],
        content: input.content as Record<string, unknown>,
        order: input.order as number | undefined,
      });
      return { success: true, id: section.id };
    }

    case "update_page_section": {
      await updatePageSection(input.sectionId as string, {
        content: input.content as Record<string, unknown> | undefined,
        isActive: input.isActive as boolean | undefined,
      });
      return { success: true };
    }

    case "delete_page_section":
      await deletePageSection(input.sectionId as string);
      return { success: true };

    case "reorder_page_sections":
      await reorderPageSections(input.pageSlug as string, input.orderedSectionIds as string[]);
      return { success: true };

    case "update_site_theme": {
      const themeUpdate: Record<string, string> = {};
      if (input.primaryColorHex) themeUpdate.primaryColorHex = input.primaryColorHex as string;
      if (input.accentColorHex) themeUpdate.accentColorHex = input.accentColorHex as string;
      if (input.fontFamily) themeUpdate.fontFamily = input.fontFamily as string;
      await updateSiteSettings(themeUpdate);
      return { success: true };
    }

    default:
      return { error: `ابزار ناشناخته: ${toolName}` };
  }
}
