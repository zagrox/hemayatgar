import { Router } from "express";
import { prisma } from "@hemayatgar/database";

const router = Router();

router.get("/", async (_req, res) => {
  const categories = await prisma.insuranceCategory.findMany({
    where: { isActive: true },
    select: { id: true, slug: true, title: true, icon: true, shortDescription: true },
    orderBy: { order: "asc" },
  });
  res.json(categories);
});

router.get("/:slug", async (req, res) => {
  const category = await prisma.insuranceCategory.findFirst({
    where: { slug: req.params.slug, isActive: true },
    include: {
      subsections: { where: { isActive: true }, orderBy: { order: "asc" } },
      faqs: true,
    },
  });
  if (!category) return res.status(404).json({ message: "رشته بیمه یافت نشد" });
  res.json(category);
});

export default router;
