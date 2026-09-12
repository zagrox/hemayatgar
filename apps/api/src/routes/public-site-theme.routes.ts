import { Router } from "express";
import { getSiteSettings } from "../services/settings.service";

const router = Router();

router.get("/", async (_req, res) => {
  const settings = await getSiteSettings();
  res.json({
    primaryColorHex: settings.primaryColorHex,
    accentColorHex: settings.accentColorHex,
    fontFamily: settings.fontFamily,
    borderRadiusStyle: settings.borderRadiusStyle,
    logoUrl: settings.logoUrl,
    faviconUrl: settings.faviconUrl,
    googleAnalyticsId: settings.googleAnalyticsId,
  });
});

export default router;
