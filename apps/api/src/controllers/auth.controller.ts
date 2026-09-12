import type { Request, Response } from "express";
import { z } from "zod";
import {
  login,
  getAdminUserById,
  InvalidCredentialsError,
  InactiveAccountError,
  requestPasswordReset,
  resetPasswordWithToken,
  InvalidResetTokenError,
} from "../services/auth.service";
import { env } from "../config/env";
import { sendEmail, isEmailEnabled } from "../config/email";

const loginSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export async function loginHandler(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }

  try {
    const { token, user } = await login(parsed.data.email, parsed.data.password);

    res.cookie("hemayatgar_token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ token, user });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return res.status(401).json({ message: error.message });
    }
    if (error instanceof InactiveAccountError) {
      return res.status(403).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "خطای غیرمنتظره در ورود به سیستم" });
  }
}

export async function meHandler(req: Request, res: Response) {
  if (!req.auth) {
    return res.status(401).json({ message: "کاربر لاگین نکرده است" });
  }

  const adminUser = await getAdminUserById(req.auth.adminUserId);
  if (!adminUser) {
    return res.status(404).json({ message: "کاربر یافت نشد" });
  }

  return res.json({
    id: adminUser.id,
    fullName: adminUser.fullName,
    email: adminUser.email,
    avatarUrl: adminUser.avatarUrl,
    role: { id: adminUser.role.id, name: adminUser.role.name, label: adminUser.role.label },
  });
}

export function logoutHandler(_req: Request, res: Response) {
  res.clearCookie("hemayatgar_token");
  return res.json({ message: "با موفقیت خارج شدید" });
}

export async function forgotPasswordHandler(req: Request, res: Response) {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "ایمیل معتبر نیست" });
  }

  if (!isEmailEnabled) {
    return res.status(503).json({
      message: "سرویس ارسال ایمیل هنوز روی سرور تنظیم نشده است. با مدیر سیستم تماس بگیرید.",
    });
  }

  const result = await requestPasswordReset(parsed.data.email);

  // عمداً حتی اگر ایمیل پیدا نشود، همین پیام موفقیت‌آمیز برگردانده می‌شود
  // تا کسی نتواند بفهمد چه ایمیل‌هایی در سیستم ثبت شده‌اند
  if (result) {
    const resetUrl = `${env.CORS_ORIGIN}/admin/reset-password?token=${result.token}`;
    await sendEmail(
      parsed.data.email,
      "بازیابی رمز عبور پنل حمایتگر",
      `<div dir="rtl" style="font-family:sans-serif;">
        <p>سلام ${result.fullName} عزیز،</p>
        <p>برای تعیین رمز عبور جدید، روی لینک زیر کلیک کنید (تا ۱ ساعت معتبر است):</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>اگر این درخواست را شما نداده‌اید، این ایمیل را نادیده بگیرید.</p>
      </div>`,
    );
  }

  return res.json({ message: "اگر این ایمیل در سیستم ثبت باشد، لینک بازیابی برایش ارسال شد." });
}

export async function resetPasswordHandler(req: Request, res: Response) {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }

  try {
    await resetPasswordWithToken(parsed.data.token, parsed.data.newPassword);
    return res.json({ message: "رمز عبور با موفقیت تغییر کرد. حالا می‌توانید وارد شوید." });
  } catch (error) {
    if (error instanceof InvalidResetTokenError) {
      return res.status(400).json({ message: error.message });
    }
    throw error;
  }
}
