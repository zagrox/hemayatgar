import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // نقش‌های پایه سیستم
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      label: "مدیر کل",
      permissions: ["*"],
    },
  });

  await prisma.role.upsert({
    where: { name: "EDITOR" },
    update: {},
    create: {
      name: "EDITOR",
      label: "ویراستار محتوا",
      permissions: [
        "pages.manage",
        "articles.manage",
        "faq.manage",
        "slider.manage",
        "media.manage",
        "insurance.manage",
      ],
    },
  });

  await prisma.role.upsert({
    where: { name: "SUPPORT" },
    update: {},
    create: {
      name: "SUPPORT",
      label: "پشتیبانی درخواست‌ها",
      permissions: ["requests.manage", "customers.manage"],
    },
  });

  // تنظیمات پایه سایت (تک‌رکوردی)
  const existingSetting = await prisma.siteSetting.findFirst();
  if (!existingSetting) {
    await prisma.siteSetting.create({
      data: {
        siteName: "حمایتگر",
        siteTagline: "نمایندگی رسمی بیمه ایران",
        agencyManager: "ملیحه علوی",
        agencyCode: "9968",
      },
    });
  }

  // رشته‌های اصلی بیمه (طبق بریف پروژه)
  const categories = [
    { slug: "car", title: "بیمه خودرو", order: 1 },
    { slug: "liability", title: "بیمه مسئولیت", order: 2 },
    { slug: "fire", title: "بیمه آتش‌سوزی", order: 3 },
    { slug: "life", title: "بیمه اشخاص", order: 4 },
    { slug: "engineering", title: "بیمه مهندسی", order: 5 },
    { slug: "transport", title: "بیمه حمل‌ونقل", order: 6 },
    { slug: "energy", title: "بیمه انرژی", order: 7 },
  ];

  for (const category of categories) {
    await prisma.insuranceCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // زیررشته‌های نمونه برای بیمه مسئولیت (طبق مثال بریف پروژه)
  const liability = await prisma.insuranceCategory.findUnique({ where: { slug: "liability" } });
  if (liability) {
    const subsections = [
      { slug: "employer", title: "مسئولیت کارفرما" },
      { slug: "doctors", title: "مسئولیت پزشکان" },
      { slug: "engineers", title: "مسئولیت مهندسین" },
      { slug: "building-managers", title: "مسئولیت مدیران ساختمان" },
      { slug: "elevator", title: "مسئولیت آسانسور" },
      { slug: "kindergarten", title: "مسئولیت مهدکودک" },
      { slug: "restaurant", title: "مسئولیت رستوران" },
      { slug: "hotel", title: "مسئولیت هتل" },
      { slug: "medical-centers", title: "مسئولیت مراکز درمانی" },
    ];

    for (const [index, sub] of subsections.entries()) {
      await prisma.insuranceSubsection.upsert({
        where: { categoryId_slug: { categoryId: liability.id, slug: sub.slug } },
        update: {},
        create: {
          categoryId: liability.id,
          slug: sub.slug,
          title: sub.title,
          order: index + 1,
          introduction: "متن معرفی این زیررشته توسط تیم محتوا تکمیل می‌شود.",
          coverages: "پوشش‌های این زیررشته توسط تیم محتوا تکمیل می‌شود.",
          exclusions: "موارد استثناء این زیررشته توسط تیم محتوا تکمیل می‌شود.",
          benefits: "مزایای این زیررشته توسط تیم محتوا تکمیل می‌شود.",
        },
      });
    }
  }

  // کاربر مدیر کل اولیه — ایمیل و رمز عبور از متغیرهای محیطی خوانده می‌شوند
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@hemayatgar.ir";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.create({
      data: {
        fullName: "ملیحه علوی",
        email: adminEmail,
        passwordHash,
        roleId: superAdminRole.id,
      },
    });
    console.log(
      `⚠️  کاربر مدیر کل با ایمیل ${adminEmail} ساخته شد. حتماً بعد از اولین ورود رمز عبور را تغییر دهید.`,
    );
  }

  // صفحات ثابت پایه (منتشرشده تا سایت خالی نباشد)
  const staticPages = [
    { slug: "about-us", title: "درباره ما" },
    { slug: "contact-us", title: "تماس با ما" },
    { slug: "cooperation", title: "همکاری با ما" },
    { slug: "customer-club", title: "باشگاه مشتریان" },
    { slug: "rates", title: "استعلام نرخ بیمه" },
    { slug: "privacy-policy", title: "حریم خصوصی" },
    { slug: "terms", title: "قوانین و مقررات استفاده" },
  ];
  for (const p of staticPages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        content: "<p>این محتوا از پنل مدیریت قابل ویرایش است.</p>",
        status: "PUBLISHED",
      },
    });
  }

  console.log("✅ داده‌های اولیه با موفقیت ثبت شدند.");
}

main()
  .catch((error) => {
    console.error("خطا در seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
