import { Router } from "express";
import { prisma } from "@hemayatgar/database";

const router = Router();

router.get("/", async (_req, res) => {
  const items = await prisma.sliderItem.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  res.json(items);
});

export default router;
