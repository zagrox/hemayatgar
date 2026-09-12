import { Router } from "express";
import { getSiteSettings } from "../services/settings.service";

const router = Router();

router.get("/", async (_req, res) => {
  const settings = await getSiteSettings();
  // فقط فیلدهای عمومی و بی‌خطر برای نمایش در سایت
  res.json({
    siteName: settings.siteName,
    siteTagline: settings.siteTagline,
    agencyManager: settings.agencyManager,
    agencyCode: settings.agencyCode,
    logoUrl: settings.logoUrl,
    phone: settings.phone,
    mobile: settings.mobile,
    email: settings.email,
    address: settings.address,
    workingHours: settings.workingHours,
    instagramUrl: settings.instagramUrl,
    telegramUrl: settings.telegramUrl,
    whatsappUrl: settings.whatsappUrl,
    baleUrl: settings.baleUrl,
    rubikaUrl: settings.rubikaUrl,
    heroImageUrl: settings.heroImageUrl,
    heroSecondaryImageUrl: settings.heroSecondaryImageUrl,
    statSatisfiedCustomers: settings.statSatisfiedCustomers,
    statPoliciesIssued: settings.statPoliciesIssued,
    statYearsExperience: settings.statYearsExperience,
  });
});

export default router;
