import { Router } from "express";
import { prisma } from "@hemayatgar/database";

const router = Router();

router.get("/", async (req, res) => {
  const categorySlug = req.query.category as string | undefined;
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      category: categorySlug ? { slug: categorySlug } : undefined,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImageUrl: true,
      publishedAt: true,
      category: { select: { title: true, slug: true } },
    },
    orderBy: { publishedAt: "desc" },
  });
  return res.json(articles);
});

router.get("/categories", async (_req, res) => {
  const categories = await prisma.articleCategory.findMany({ orderBy: { title: "asc" } });
  return res.json(categories);
});

router.get("/:slug", async (req, res) => {
  const article = await prisma.article.findFirst({
    where: { slug: req.params.slug, status: "PUBLISHED" },
    include: { category: true },
  });
  if (!article) return res.status(404).json({ message: "مقاله یافت نشد" });
  return res.json(article);
});

export default router;
