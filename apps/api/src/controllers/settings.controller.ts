import type { Request, Response } from "express";
import { z } from "zod";
import { getSiteSettings, updateSiteSettings } from "../services/settings.service";

const settingsSchema = z.object({
  siteName: z.string().optional(),
  siteTagline: z.string().optional(),
  logoUrl: z.string().optional().or(z.literal("")),
  faviconUrl: z.string().optional().or(z.literal("")),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  workingHours: z.string().optional(),
  instagramUrl: z.string().optional(),
  telegramUrl: z.string().optional(),
  whatsappUrl: z.string().optional(),
  baleUrl: z.string().optional(),
  rubikaUrl: z.string().optional(),
  defaultSeoTitle: z.string().optional(),
  defaultSeoDescription: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  googleSearchConsole: z.string().optional(),
  primaryColorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "کد رنگ باید مثل #1F4573 باشد").optional(),
  accentColorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "کد رنگ باید مثل #F5720F باشد").optional(),
  fontFamily: z.enum(["vazirmatn", "noto"]).optional(),
  borderRadiusStyle: z.enum(["sharp", "rounded", "pill"]).optional(),
  heroImageUrl: z.string().optional().or(z.literal("")),
  heroSecondaryImageUrl: z.string().optional().or(z.literal("")),
  statSatisfiedCustomers: z.string().optional(),
  statPoliciesIssued: z.string().optional(),
  statYearsExperience: z.string().optional(),
});

export async function getSettingsHandler(_req: Request, res: Response) {
  const settings = await getSiteSettings();
  return res.json(settings);
}

export async function updateSettingsHandler(req: Request, res: Response) {
  const parsed = settingsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }

  const settings = await updateSiteSettings(parsed.data);
  return res.json(settings);
}
