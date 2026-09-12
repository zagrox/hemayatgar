# راه‌اندازی دیتابیس پروژه حمایتگر

نوع دیتابیس: **PostgreSQL**

این پروژه فایل دیتابیس آماده (dump / .sql) ندارد؛ ساختار دیتابیس (جدول‌ها) از طریق Prisma
و بر اساس فایل `packages/database/prisma/schema.prisma` ساخته می‌شود. یکی از دو روش زیر را
انتخاب کنید.

---

## روش ۱: با Docker (ساده‌ترین، پیشنهادی)

اگر Docker روی سیستم نصب است:

```bash
cd hemayatgar-insurance
cp .env.example .env

docker compose up -d --build

docker compose exec api pnpm --filter @hemayatgar/database prisma migrate deploy
docker compose exec api pnpm --filter @hemayatgar/database prisma:seed
```

این دستورها هم خودِ PostgreSQL رو بالا میارن، هم جدول‌ها رو می‌سازن، هم داده اولیه (کاربر مدیر
کل + ۷ رشته بیمه) رو وارد می‌کنن. نیازی به نصب جداگانه PostgreSQL نیست.

---

## روش ۲: نصب دستی PostgreSQL روی سیستم

### مرحله ۱ — نصب PostgreSQL (نسخه ۱۴ به بالا)
- ویندوز: از سایت رسمی [postgresql.org](https://www.postgresql.org/download/) نصب کنید
- مک: `brew install postgresql`
- لینوکس: `sudo apt install postgresql`

### مرحله ۲ — ساخت یک دیتابیس خالی
```bash
psql -U postgres
CREATE DATABASE hemayatgar_insurance;
```

### مرحله ۳ — تنظیم متغیر اتصال
در فایل `.env` (کپی‌شده از `.env.example`) مقدار زیر را با اطلاعات واقعی خودتان جایگزین کنید:

```
DATABASE_URL="postgresql://username:password@localhost:5432/hemayatgar_insurance"
```

### مرحله ۴ — ساخت جدول‌ها و وارد کردن داده اولیه
```bash
pnpm install
pnpm --filter @hemayatgar/database prisma:generate
pnpm --filter @hemayatgar/database prisma:migrate
pnpm --filter @hemayatgar/database prisma:seed
```

- `prisma:generate` — کلاینت Prisma را می‌سازد
- `prisma:migrate` — تمام جدول‌های پروژه (کاربران، درخواست‌ها، رشته‌های بیمه، مشتریان و غیره)
  را طبق `schema.prisma` در دیتابیس می‌سازد
- `prisma:seed` — کاربر مدیر کل اولیه، نقش‌ها، تنظیمات پایه سایت و ۷ رشته بیمه را وارد می‌کند

---

## بعد از راه‌اندازی

```bash
pnpm dev
```

- سایت عمومی: `http://localhost:3000`
- پنل مدیریت: `http://localhost:3000/admin/login`
- API: `http://localhost:4000`

ورود اولیه به پنل با مقادیر `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` در `.env`
(پیش‌فرض: `admin@hemayatgar.ir` / `ChangeMe123!`) — حتماً بعد از اولین ورود رمز عبور را تغییر دهید.

برای مشاهده و بررسی دیتابیس با رابط گرافیکی:
```bash
pnpm --filter @hemayatgar/database prisma:studio
```
