import type { Request, Response } from "express";
import { z } from "zod";
import { listAdminUsers, createAdminUser, updateAdminUser, listRoles } from "../services/user.service";

const createUserSchema = z.object({
  fullName: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  email: z.string().email("ایمیل معتبر نیست"),
  mobile: z.string().optional(),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  roleId: z.string().min(1, "نقش کاربر باید مشخص شود"),
});

const updateUserSchema = z.object({
  fullName: z.string().min(2).optional(),
  mobile: z.string().optional(),
  roleId: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function listUsersHandler(_req: Request, res: Response) {
  const users = await listAdminUsers();
  return res.json(users);
}

export async function listRolesHandler(_req: Request, res: Response) {
  const roles = await listRoles();
  return res.json(roles);
}

export async function createUserHandler(req: Request, res: Response) {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }

  try {
    const user = await createAdminUser(parsed.data);
    return res.status(201).json({ id: user.id, email: user.email });
  } catch {
    return res.status(409).json({ message: "این ایمیل قبلاً ثبت شده است" });
  }
}

export async function updateUserHandler(req: Request, res: Response) {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }

  const user = await updateAdminUser(req.params.id, parsed.data);
  return res.json({ id: user.id });
}
