import type { Request, Response } from "express";
import { z } from "zod";
import {
  listArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  listArticleCategories,
  createArticleCategory,
} from "../services/article.service";

const createSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverImageUrl: z.string().optional(),
  categoryId: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const updateSchema = z.object({
  title: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImageUrl: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function listArticlesHandler(_req: Request, res: Response) {
  return res.json(await listArticles());
}

export async function getArticleHandler(req: Request, res: Response) {
  const article = await getArticleBySlug(req.params.slug);
  if (!article) return res.status(404).json({ message: "مقاله یافت نشد" });
  return res.json(article);
}

export async function createArticleHandler(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  try {
    const article = await createArticle({ ...parsed.data, authorId: req.auth?.adminUserId });
    return res.status(201).json(article);
  } catch {
    return res.status(409).json({ message: "این نشانی (slug) قبلاً استفاده شده است" });
  }
}

export async function updateArticleHandler(req: Request, res: Response) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  const data = { ...parsed.data, ...(parsed.data.status === "PUBLISHED" ? { publishedAt: new Date() } : {}) };
  return res.json(await updateArticle(req.params.id, data));
}

export async function deleteArticleHandler(req: Request, res: Response) {
  await deleteArticle(req.params.id);
  return res.status(204).send();
}

export async function listArticleCategoriesHandler(_req: Request, res: Response) {
  return res.json(await listArticleCategories());
}

export async function createArticleCategoryHandler(req: Request, res: Response) {
  const parsed = z.object({ slug: z.string().min(1), title: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  return res.status(201).json(await createArticleCategory(parsed.data));
}
