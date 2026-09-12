import { Router } from "express";
import { listPageSections } from "../services/page-section.service";

const router = Router();

router.get("/:pageSlug", async (req, res) => {
  const sections = await listPageSections(req.params.pageSlug, true);
  res.json(sections);
});

export default router;
