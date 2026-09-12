import { Router } from "express";
import { prisma } from "@hemayatgar/database";

const router = Router();

router.get("/:slug", async (req, res) => {
  const page = await prisma.page.findFirst({
    where: { slug: req.params.slug, status: "PUBLISHED" },
    include: { faqs: true },
  });
  if (!page) return res.status(404).json({ message: "صفحه یافت نشد" });
  return res.json(page);
});

export default router;
