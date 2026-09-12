# نقشه کامل پروژه — سایت حمایتگر (نمایندگی بیمه ایران، کد ۹۹۶۸)

فایل ارسالی: **hemayatgar-insurance-FINAL.zip** (شامل هر ۱۰ بسته کاری، نیازی به فایل دیگری نیست)

---

## ۱. پیش‌نیازها برای اجرا

- Node.js نسخه ۲۰ به بالا
- pnpm (`corepack enable` سپس `corepack prepare pnpm@9.7.0 --activate`)
- دیتابیس PostgreSQL (یا Docker برای اجرای خودکار آن)

## ۲. مراحل راه‌اندازی (توسعه محلی)

```bash
unzip hemayatgar-insurance-FINAL.zip
cd hemayatgar-insurance

pnpm install

cp .env.example .env
# مقادیر DATABASE_URL و JWT_SECRET را در .env با مقادیر واقعی جایگزین کنید

pnpm --filter @hemayatgar/database prisma:generate
pnpm --filter @hemayatgar/database prisma:migrate
pnpm --filter @hemayatgar/database prisma:seed

pnpm dev
```

بعد از اجرا:
- سایت عمومی: `http://localhost:3000`
- پنل مدیریت: `http://localhost:3000/admin/login`
- API: `http://localhost:4000`

ورود اولیه به پنل با مقادیر `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` در `.env`
(پیش‌فرض: `admin@hemayatgar.ir` / `ChangeMe123!`) — حتماً بعد از اولین ورود عوض شود.

### راه‌اندازی جایگزین با Docker (ساده‌تر)

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec api pnpm --filter @hemayatgar/database prisma migrate deploy
docker compose exec api pnpm --filter @hemayatgar/database prisma:seed
```

جزئیات کامل استقرار روی سرور در فایل `DEPLOYMENT.md` هست.

---

## ۳. نقشه صفحات سایت عمومی (بازدیدکننده)

| مسیر | توضیح |
|------|-------|
| `/` | صفحه اصلی |
| `/insurance` | فهرست همه رشته‌های بیمه |
| `/insurance/[slug]` | صفحه جامع هر رشته بیمه (مثل `/insurance/car`, `/insurance/liability`) |
| `/blog` | فهرست مقالات |
| `/blog/[slug]` | جزئیات مقاله |
| `/about-us` | درباره ما |
| `/contact-us` | تماس با ما |
| `/cooperation` | همکاری با ما |
| `/faq` | سوالات متداول |
| `/search?q=...` | جستجوی سایت |

## ۴. نقشه پنل مدیریت (`/admin/...`)

| مسیر | توضیح |
|------|-------|
| `/admin/login` | ورود |
| `/admin/dashboard` | داشبورد و آمار |
| `/admin/requests` | مدیریت درخواست‌های مشاوره |
| `/admin/customers` | مدیریت مشتریان |
| `/admin/content` | هاب مدیریت محتوا (صفحات، اسلایدر، تصاویر، مقالات، FAQ) |
| `/admin/content/articles` | مدیریت مقالات وبلاگ |
| `/admin/insurance` | مدیریت رشته‌های بیمه |
| `/admin/users` | مدیریت کاربران پنل |
| `/admin/settings` | تنظیمات سایت |
| `/admin/profile` | پروفایل شخصی |

## ۵. مسیرهای API (برای هر توسعه‌دهنده‌ای که بخواد وصل بشه)

**عمومی (بدون نیاز به لاگین):**
- `GET /api/insurance-categories` و `/api/insurance-categories/:slug`
- `GET /api/articles` و `/api/articles/:slug`
- `GET /api/pages/:slug`
- `GET /api/faq`
- `GET /api/slider`
- `GET /api/site-settings`
- `GET /api/search?q=...`
- `POST /api/requests` (ثبت فرم درخواست مشاوره)

**مدیریتی (نیاز به لاگین و مجوز):**
- `POST /api/auth/login`, `GET /api/auth/me`
- `/api/admin/dashboard`, `/api/admin/users`, `/api/admin/profile`, `/api/admin/settings`
- `/api/admin/pages`, `/api/admin/slider`, `/api/admin/media`, `/api/admin/articles`, `/api/admin/faq`
- `/api/admin/insurance-categories`, `/api/admin/insurance-subsections`
- `/api/admin/requests`, `/api/admin/notifications`, `/api/admin/customers`

## ۶. نکات مهم برای طراح/دولوپر

- استک: Next.js 15 (React 19) + Express + Prisma + PostgreSQL، در قالب مونوریپو Turborepo/pnpm
- پالت رنگی: سرمه‌ای (`navy`) و نارنجی (`orange`) — تعریف‌شده در `apps/web/tailwind.config.ts`
- فونت: Vazirmatn (فارسی، RTL کامل)
- جاهایی که placeholder رنگی گذاشته شده (عکس نماینده، آیکون رشته‌های بیمه) باید با تصاویر واقعی
  از طریق پنل مدیریت (بخش «مدیریت تصاویر») جایگزین بشه
- **این نسخه هنوز اجرا/تست واقعی نشده** — قبل از تحویل به مشتری نهایی، حتماً یک‌بار مراحل بخش ۲
  همین سند روی یک سیستم واقعی با PostgreSQL اجرا و بررسی بشه
