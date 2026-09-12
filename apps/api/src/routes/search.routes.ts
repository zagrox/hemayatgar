import { Router } from "express";
import { prisma } from "@hemayatgar/database";

const router = Router();

router.get("/", async (req, res) => {
  const q = (req.query.q as string | undefined)?.trim();
  if (!q) return res.json({ pages: [], articles: [], insuranceCategories: [] });

  const [pages, articles, insuranceCategories] = await Promise.all([
    prisma.page.findMany({
      where: { status: "PUBLISHED", title: { contains: q, mode: "insensitive" } },
      select: { slug: true, title: true },
      take: 10,
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED", title: { contains: q, mode: "insensitive" } },
      select: { slug: true, title: true, excerpt: true },
      take: 10,
    }),
    prisma.insuranceCategory.findMany({
      where: { isActive: true, title: { contains: q, mode: "insensitive" } },
      select: { slug: true, title: true, shortDescription: true },
      take: 10,
    }),
  ]);

  return res.json({ pages, articles, insuranceCategories });
});

export default router;
