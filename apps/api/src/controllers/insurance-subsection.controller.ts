import type { Request, Response } from "express";
import { z } from "zod";
import {
  createInsuranceSubsection,
  updateInsuranceSubsection,
  deleteInsuranceSubsection,
} from "../services/insurance-subsection.service";

const createSchema = z.object({
  categoryId: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  order: z.number().int().optional(),
  introduction: z.string().min(1),
  coverages: z.string().min(1),
  exclusions: z.string().min(1),
  benefits: z.string().min(1),
  imageUrl: z.string().optional(),
  isStandalonePage: z.boolean().optional(),
});

const updateSchema = z.object({
  title: z.string().optional(),
  order: z.number().int().optional(),
  introduction: z.string().optional(),
  coverages: z.string().optional(),
  exclusions: z.string().optional(),
  benefits: z.string().optional(),
  imageUrl: z.string().optional(),
  isStandalonePage: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function createSubsectionHandler(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  try {
    return res.status(201).json(await createInsuranceSubsection(parsed.data));
  } catch {
    return res.status(409).json({ message: "این نشانی (slug) در این رشته قبلاً استفاده شده است" });
  }
}

export async function updateSubsectionHandler(req: Request, res: Response) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  return res.json(await updateInsuranceSubsection(req.params.id, parsed.data));
}

export async function deleteSubsectionHandler(req: Request, res: Response) {
  await deleteInsuranceSubsection(req.params.id);
  return res.status(204).send();
}
