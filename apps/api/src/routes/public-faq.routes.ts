import { Router } from "express";
import { prisma } from "@hemayatgar/database";

const router = Router();

router.get("/", async (req, res) => {
  const { pageSlug, insuranceCategorySlug, global } = req.query;

  const faqs = await prisma.faqItem.findMany({
    where: {
      isGlobal: global === "true" ? true : undefined,
      page: pageSlug ? { slug: pageSlug as string } : undefined,
      insuranceCategory: insuranceCategorySlug
        ? { slug: insuranceCategorySlug as string }
        : undefined,
    },
    orderBy: { order: "asc" },
  });
  return res.json(faqs);
});

export default router;
