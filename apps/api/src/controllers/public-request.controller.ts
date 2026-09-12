import type { Request, Response } from "express";
import { z } from "zod";
import { createConsultationRequest } from "../services/request.service";
import { IRANIAN_MOBILE_REGEX } from "../utils/validators";

const publicRequestSchema = z.object({
  fullName: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  mobile: z.string().regex(IRANIAN_MOBILE_REGEX, "شماره موبایل معتبر نیست (مثال: 09123456789)"),
  insuranceCategoryId: z.string().optional(),
  description: z.string().max(1000, "توضیحات حداکثر ۱۰۰۰ کاراکتر می‌تواند باشد").optional(),
});

export async function createPublicRequestHandler(req: Request, res: Response) {
  const parsed = publicRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }

  const request = await createConsultationRequest(parsed.data);
  return res.status(201).json({
    message: "درخواست شما با موفقیت ثبت شد. کارشناسان ما در اسرع وقت با شما تماس می‌گیرند.",
    id: request.id,
  });
}
