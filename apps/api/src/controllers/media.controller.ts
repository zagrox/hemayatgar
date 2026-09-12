import type { Request, Response } from "express";
import { listMediaFiles, createMediaFile, deleteMediaFile } from "../services/media.service";
import { processImageForTarget, IMAGE_PRESETS, type ImageTarget } from "../services/image-processing.service";

export async function listMediaHandler(_req: Request, res: Response) {
  return res.json(await listMediaFiles());
}

export async function uploadMediaHandler(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: "فایلی برای آپلود ارسال نشده است" });
  }

  let fileUrl = `/uploads/${req.file.filename}`;

  // اگر مقصد مشخص فرستاده شده باشد (مثلاً purpose=article_cover)، دقیقاً مطابق آن قالب
  // ریسایز/کراپ می‌شود؛ در غیر این صورت تصویر اصلی بدون تغییر ذخیره می‌شود
  const purpose = req.body.purpose as string | undefined;
  if (purpose && purpose in IMAGE_PRESETS) {
    fileUrl = await processImageForTarget(fileUrl, purpose as ImageTarget);
  }

  const media = await createMediaFile({
    url: fileUrl,
    altText: req.body.altText,
    sizeInBytes: req.file.size,
    uploadedById: req.auth?.adminUserId,
  });

  return res.status(201).json(media);
}

export async function deleteMediaHandler(req: Request, res: Response) {
  await deleteMediaFile(req.params.id);
  return res.status(204).send();
}
