import type { Request, Response } from "express";
import { z } from "zod";
import {
  listPageSections,
  createPageSection,
  updatePageSection,
  deletePageSection,
  reorderPageSections,
} from "../services/page-section.service";

const SECTION_TYPES = [
  "HERO",
  "TEXT_IMAGE",
  "FEATURE_GRID",
  "TESTIMONIALS",
  "CTA_BANNER",
  "IMAGE_GALLERY",
  "CUSTOM_HTML",
] as const;

const createSchema = z.object({
  pageSlug: z.string().min(1),
  type: z.enum(SECTION_TYPES),
  content: z.record(z.unknown()),
  order: z.number().int().optional(),
});

const updateSchema = z.object({
  content: z.record(z.unknown()).optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function listSectionsHandler(req: Request, res: Response) {
  return res.json(await listPageSections(req.params.pageSlug));
}

export async function createSectionHandler(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  return res.status(201).json(await createPageSection(parsed.data));
}

export async function updateSectionHandler(req: Request, res: Response) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  return res.json(await updatePageSection(req.params.id, parsed.data));
}

export async function deleteSectionHandler(req: Request, res: Response) {
  await deletePageSection(req.params.id);
  return res.status(204).send();
}

export async function reorderSectionsHandler(req: Request, res: Response) {
  const parsed = z
    .object({ pageSlug: z.string().min(1), orderedIds: z.array(z.string()) })
    .safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  return res.json(await reorderPageSections(parsed.data.pageSlug, parsed.data.orderedIds));
}
