import rateLimit from "express-rate-limit";

export const publicRequestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ۱۵ دقیقه
  limit: 5,
  message: { message: "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً چند دقیقه دیگر تلاش کنید." },
  standardHeaders: true,
  legacyHeaders: false,
});
