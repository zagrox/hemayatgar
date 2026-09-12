import type { Request, Response } from "express";
import { z } from "zod";
import {
  listSliderItems,
  createSliderItem,
  updateSliderItem,
  deleteSliderItem,
} from "../services/slider.service";

const createSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  imageUrl: z.string(),
  linkUrl: z.string().optional(),
  order: z.number().int().optional(),
});

const updateSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  imageUrl: z.string().optional(),
  linkUrl: z.string().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function listSliderHandler(_req: Request, res: Response) {
  return res.json(await listSliderItems());
}

export async function createSliderHandler(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  return res.status(201).json(await createSliderItem(parsed.data));
}

export async function updateSliderHandler(req: Request, res: Response) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  return res.json(await updateSliderItem(req.params.id, parsed.data));
}

export async function deleteSliderHandler(req: Request, res: Response) {
  await deleteSliderItem(req.params.id);
  return res.status(204).send();
}
