# راهنمای استقرار (Deployment)

## پیش‌نیازها
- Docker و Docker Compose
- یک دامنه و گواهی SSL (برای تولید، پشت Nginx یا Caddy)

## مراحل استقرار با Docker

```bash
cp .env.example .env
# مقادیر واقعی (DATABASE_URL, JWT_SECRET, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD و ...) را در .env تنظیم کنید

docker compose up -d --build

# اجرای مایگریشن و seed اولیه (فقط بار اول)
docker compose exec api pnpm --filter @hemayatgar/database prisma migrate deploy
docker compose exec api pnpm --filter @hemayatgar/database prisma:seed
```

سرویس‌ها:
- وب (Next.js): پورت ۳۰۰۰
- API (Express): پورت ۴۰۰۰
- PostgreSQL: پورت ۵۴۳۲

## بکاپ‌گیری منظم

اسکریپت `scripts/backup-db.sh` یک بکاپ فشرده از دیتابیس می‌گیرد و فقط ۱۴ بکاپ آخر را نگه
می‌دارد. برای اجرای خودکار روزانه، یک کرون‌جاب مثل زیر تنظیم کنید:

```
0 3 * * * DATABASE_URL="postgresql://..." /path/to/hemayatgar-insurance/scripts/backup-db.sh
```

## چک‌لیست پیش از رفتن به تولید (Production)

- [ ] `JWT_SECRET` را به یک مقدار تصادفی و قوی تغییر دهید
- [ ] رمز عبور کاربر مدیر کل (seed) را بلافاصله بعد از اولین ورود تغییر دهید
- [ ] `NODE_ENV=production` تنظیم شود
- [ ] HTTPS از طریق ریورس‌پروکسی (Nginx/Caddy) فعال شود
- [ ] بکاپ خودکار دیتابیس زمان‌بندی شود
- [ ] مانیتورینگ لاگ‌ها (خروجی pino) به سرویسی مثل یک لاگ‌دراگر متصل شود

## فعال‌سازی بازیابی رمز عبور (ایمیل)

برای اینکه دکمه «رمز عبور را فراموش کرده‌اید» کار کند، باید یک App Password از Gmail بگیرید
(نه رمز عبور معمولی جیمیل — گوگل اجازه اتصال SMTP با رمز عادی را نمی‌دهد):

1. وارد حساب Gmail شوید (`m.alaviins@gmail.com`) → **مدیریت حساب Google**
2. **امنیت** → مطمئن شوید تأیید دومرحله‌ای (2-Step Verification) فعال است
3. در همان بخش امنیت، **App passwords** را جستجو کنید → یک رمز جدید برای «Mail» بسازید
4. رمز ۱۶ کاراکتری تولیدشده را در `.env` قرار دهید:
   ```
   EMAIL_USER="m.alaviins@gmail.com"
   EMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
   ```
5. سرور API را ری‌استارت کنید

اگر این دو متغیر تنظیم نشوند، دکمه فراموشی رمز فقط یک پیام خطای مودبانه نشان می‌دهد و هیچ
ایمیلی ارسال نمی‌شود — هیچ کرشی رخ نمی‌دهد.
