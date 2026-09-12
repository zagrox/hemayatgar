import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { requestLogger, errorLogger } from "./middlewares/logging";
import { logger } from "./config/logger";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import userRoutes from "./routes/user.routes";
import profileRoutes from "./routes/profile.routes";
import settingsRoutes from "./routes/settings.routes";
import pageRoutes from "./routes/page.routes";
import sliderRoutes from "./routes/slider.routes";
import mediaRoutes from "./routes/media.routes";
import articleRoutes from "./routes/article.routes";
import faqRoutes from "./routes/faq.routes";
import insuranceCategoryRoutes from "./routes/insurance-category.routes";
import insuranceSubsectionRoutes from "./routes/insurance-subsection.routes";
import publicRequestRoutes from "./routes/public-request.routes";
import publicInsuranceCategoryRoutes from "./routes/public-insurance-category.routes";
import requestRoutes from "./routes/request.routes";
import notificationRoutes from "./routes/notification.routes";
import customerRoutes from "./routes/customer.routes";
import publicPageRoutes from "./routes/public-page.routes";
import publicArticleRoutes from "./routes/public-article.routes";
import publicFaqRoutes from "./routes/public-faq.routes";
import publicSliderRoutes from "./routes/public-slider.routes";
import publicSettingsRoutes from "./routes/public-settings.routes";
import searchRoutes from "./routes/search.routes";
import aiRoutes from "./routes/ai.routes";
import pageSectionRoutes from "./routes/page-section.routes";
import publicPageSectionRoutes from "./routes/public-page-section.routes";
import publicSiteThemeRoutes from "./routes/public-site-theme.routes";
import { scheduleWeeklyArticleJob } from "./jobs/weekly-article-job";
import path from "node:path";
import { UPLOAD_DIR } from "./config/upload";

const app = express();

app.use(helmet());
app.use(compression());
app.use(requestLogger);
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/users", userRoutes);
app.use("/api/admin/profile", profileRoutes);
app.use("/api/admin/settings", settingsRoutes);
app.use("/api/admin/pages", pageRoutes);
app.use("/api/admin/slider", sliderRoutes);
app.use("/api/admin/media", mediaRoutes);
app.use("/api/admin/articles", articleRoutes);
app.use("/api/admin/faq", faqRoutes);
app.use("/api/admin/insurance-categories", insuranceCategoryRoutes);
app.use("/api/admin/insurance-subsections", insuranceSubsectionRoutes);
app.use("/api/admin/requests", requestRoutes);
app.use("/api/admin/notifications", notificationRoutes);
app.use("/api/admin/customers", customerRoutes);
app.use("/api/requests", publicRequestRoutes);
app.use("/api/insurance-categories", publicInsuranceCategoryRoutes);
app.use("/api/pages", publicPageRoutes);
app.use("/api/articles", publicArticleRoutes);
app.use("/api/faq", publicFaqRoutes);
app.use("/api/slider", publicSliderRoutes);
app.use("/api/site-settings", publicSettingsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/admin/ai", aiRoutes);
app.use("/api/admin/page-sections", pageSectionRoutes);
app.use("/api/page-sections", publicPageSectionRoutes);
app.use("/api/site-theme", publicSiteThemeRoutes);
app.use("/uploads", express.static(UPLOAD_DIR));

// همه مسیرهای اصلی پروژه اینجا وصل شدند
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "hemayatgar-api" });
});

app.use((_req, res) => {
  res.status(404).json({ message: "مسیر مورد نظر یافت نشد" });
});

app.use(errorLogger);

app.listen(env.PORT, () => {
  logger.info(`✅ Hemayatgar API روی پورت ${env.PORT} اجرا شد`);
  scheduleWeeklyArticleJob();
});
