import type { Request, Response } from "express";
import { z } from "zod";
import fs from "node:fs/promises";
import { runAiAssistant, AiNotConfiguredError, type AiChatMessage } from "../services/ai-assistant.service";
import { createMediaFile } from "../services/media.service";
import { isAiEnabled } from "../config/ai";

const chatSchema = z.object({
  message: z.string().min(1, "پیام نمی‌تواند خالی باشد"),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .optional()
    .default([]),
});

export async function aiStatusHandler(_req: Request, res: Response) {
  return res.json({ enabled: isAiEnabled });
}

export async function aiChatHandler(req: Request, res: Response) {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }

  let userMessage = parsed.data.message;
  let attachedImage: { base64: string; mediaType: string } | undefined;

  // اگر کاربر تصویری پیوست کرده: هم در کتابخانه رسانه ذخیره می‌شود (برای استفاده در set_image)
  // و هم واقعاً به‌صورت base64 به مدل داده می‌شود تا دستیار طرح را «ببیند»، نه فقط لینکش را بداند
  if (req.file) {
    const fileUrl = `/uploads/${req.file.filename}`;
    await createMediaFile({ url: fileUrl, uploadedById: req.auth?.adminUserId });
    userMessage += `\n\n[کاربر یک تصویر پیوست کرده است — اگر خواستی این تصویر را جایی جایگزین کنی، آدرس آن: ${fileUrl}]`;

    try {
      const buffer = await fs.readFile(req.file.path);
      attachedImage = { base64: buffer.toString("base64"), mediaType: req.file.mimetype };
    } catch {
      // اگر خواندن فایل برای vision شکست خورد، حداقل آدرس آن در userMessage باقی می‌ماند
    }
  }

  try {
    const result = await runAiAssistant(
      parsed.data.history as AiChatMessage[],
      userMessage,
      req.auth!.adminUserId,
      attachedImage,
    );
    return res.json(result);
  } catch (error) {
    if (error instanceof AiNotConfiguredError) {
      return res.status(503).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "خطا در ارتباط با دستیار هوش مصنوعی" });
  }
}
