import type { Request, Response } from "express";
import { z } from "zod";
import { listPages, getPageBySlug, createPage, updatePage, deletePage } from "../services/page.service";

const createSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
});

const updateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
});

export async function listPagesHandler(_req: Request, res: Response) {
  return res.json(await listPages());
}

export async function getPageHandler(req: Request, res: Response) {
  const page = await getPageBySlug(req.params.slug);
  if (!page) return res.status(404).json({ message: "صفحه یافت نشد" });
  return res.json(page);
}

export async function createPageHandler(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  try {
    const page = await createPage(parsed.data);
    return res.status(201).json(page);
  } catch {
    return res.status(409).json({ message: "این نشانی (slug) قبلاً استفاده شده است" });
  }
}

export async function updatePageHandler(req: Request, res: Response) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  return res.json(await updatePage(req.params.id, parsed.data));
}

export async function deletePageHandler(req: Request, res: Response) {
  await deletePage(req.params.id);
  return res.status(204).send();
}
