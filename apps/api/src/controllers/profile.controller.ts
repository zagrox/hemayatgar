import type { Request, Response } from "express";
import { z } from "zod";
import { updateOwnProfile, changeOwnPassword, WrongCurrentPasswordError } from "../services/profile.service";

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  mobile: z.string().optional(),
  avatarUrl: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "رمز عبور فعلی الزامی است"),
  newPassword: z.string().min(6, "رمز عبور جدید باید حداقل ۶ کاراکتر باشد"),
});

export async function updateProfileHandler(req: Request, res: Response) {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }

  const user = await updateOwnProfile(req.auth!.adminUserId, parsed.data);
  return res.json({ id: user.id, fullName: user.fullName });
}

export async function changePasswordHandler(req: Request, res: Response) {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }

  try {
    await changeOwnPassword(req.auth!.adminUserId, parsed.data.currentPassword, parsed.data.newPassword);
    return res.json({ message: "رمز عبور با موفقیت تغییر کرد" });
  } catch (error) {
    if (error instanceof WrongCurrentPasswordError) {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "خطای غیرمنتظره" });
  }
}
