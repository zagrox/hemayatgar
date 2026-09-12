import type { Request, Response } from "express";
import { z } from "zod";
import {
  listCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addCustomerInteraction,
} from "../services/customer.service";
import { IRANIAN_MOBILE_REGEX } from "../utils/validators";

const createSchema = z.object({
  fullName: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  mobile: z.string().regex(IRANIAN_MOBILE_REGEX, "شماره موبایل معتبر نیست"),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
});

const updateSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
});

const interactionSchema = z.object({
  type: z.enum(["CALL", "MEETING", "WHATSAPP", "NOTE", "OTHER"]),
  description: z.string().min(1, "توضیحات نمی‌تواند خالی باشد"),
});

export async function listCustomersHandler(req: Request, res: Response) {
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  return res.json(await listCustomers(search));
}

export async function getCustomerHandler(req: Request, res: Response) {
  const customer = await getCustomerById(req.params.id);
  if (!customer) return res.status(404).json({ message: "مشتری یافت نشد" });
  return res.json(customer);
}

export async function createCustomerHandler(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  try {
    return res.status(201).json(await createCustomer(parsed.data));
  } catch {
    return res.status(409).json({ message: "این شماره موبایل قبلاً ثبت شده است" });
  }
}

export async function updateCustomerHandler(req: Request, res: Response) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  return res.json(await updateCustomer(req.params.id, parsed.data));
}

export async function deleteCustomerHandler(req: Request, res: Response) {
  await deleteCustomer(req.params.id);
  return res.status(204).send();
}

export async function addInteractionHandler(req: Request, res: Response) {
  const parsed = interactionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  const interaction = await addCustomerInteraction(req.params.id, {
    ...parsed.data,
    createdById: req.auth?.adminUserId,
  });
  return res.status(201).json(interaction);
}
