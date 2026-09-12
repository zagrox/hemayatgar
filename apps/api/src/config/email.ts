import nodemailer from "nodemailer";
import { logger } from "./logger";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

export const isEmailEnabled = Boolean(EMAIL_USER && EMAIL_APP_PASSWORD);

export const emailTransporter = isEmailEnabled
  ? nodemailer.createTransport({
      service: "gmail",
      auth: { user: EMAIL_USER, pass: EMAIL_APP_PASSWORD },
    })
  : null;

export async function sendEmail(to: string, subject: string, html: string) {
  if (!emailTransporter) {
    logger.warn("سرویس ایمیل تنظیم نشده — EMAIL_USER / EMAIL_APP_PASSWORD در .env قرار نگرفته");
    return false;
  }
  await emailTransporter.sendMail({
    from: `"حمایتگر" <${EMAIL_USER}>`,
    to,
    subject,
    html,
  });
  return true;
}
