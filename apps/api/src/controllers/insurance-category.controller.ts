import type { Request, Response } from "express";
import { z } from "zod";
import {
  listInsuranceCategories,
  getInsuranceCategoryBySlug,
  createInsuranceCategory,
  updateInsuranceCategory,
  deleteInsuranceCategory,
} from "../services/insurance-category.service";

const createSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  shortDescription: z.string().optional(),
  icon: z.string().optional(),
  heroImageUrl: z.string().optional(),
  order: z.number().int().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const updateSchema = z.object({
  title: z.string().optional(),
  shortDescription: z.string().optional(),
  icon: z.string().optional(),
  heroImageUrl: z.string().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function listCategoriesHandler(_req: Request, res: Response) {
  return res.json(await listInsuranceCategories());
}

export async function getCategoryHandler(req: Request, res: Response) {
  const category = await getInsuranceCategoryBySlug(req.params.slug);
  if (!category) return res.status(404).json({ message: "رشته بیمه یافت نشد" });
  return res.json(category);
}

export async function createCategoryHandler(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  try {
    return res.status(201).json(await createInsuranceCategory(parsed.data));
  } catch {
    return res.status(409).json({ message: "این نشانی (slug) قبلاً استفاده شده است" });
  }
}

export async function updateCategoryHandler(req: Request, res: Response) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  return res.json(await updateInsuranceCategory(req.params.id, parsed.data));
}

export async function deleteCategoryHandler(req: Request, res: Response) {
  await deleteInsuranceCategory(req.params.id);
  return res.status(204).send();
}
