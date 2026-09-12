import type { Request, Response } from "express";
import { z } from "zod";
import { listFaqItems, createFaqItem, updateFaqItem, deleteFaqItem } from "../services/faq.service";

const createSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  order: z.number().int().optional(),
  isGlobal: z.boolean().optional(),
  pageId: z.string().optional(),
  insuranceCategoryId: z.string().optional(),
  insuranceSubsectionId: z.string().optional(),
});

const updateSchema = z.object({
  question: z.string().optional(),
  answer: z.string().optional(),
  order: z.number().int().optional(),
  isGlobal: z.boolean().optional(),
});

export async function listFaqHandler(req: Request, res: Response) {
  const { pageId, insuranceCategoryId, insuranceSubsectionId } = req.query;
  return res.json(
    await listFaqItems({
      pageId: pageId as string | undefined,
      insuranceCategoryId: insuranceCategoryId as string | undefined,
      insuranceSubsectionId: insuranceSubsectionId as string | undefined,
    }),
  );
}

export async function createFaqHandler(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  return res.status(201).json(await createFaqItem(parsed.data));
}

export async function updateFaqHandler(req: Request, res: Response) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  return res.json(await updateFaqItem(req.params.id, parsed.data));
}

export async function deleteFaqHandler(req: Request, res: Response) {
  await deleteFaqItem(req.params.id);
  return res.status(204).send();
}
