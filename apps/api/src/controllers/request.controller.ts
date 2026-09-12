import type { Request, Response } from "express";
import { z } from "zod";
import {
  listConsultationRequests,
  getConsultationRequestById,
  updateConsultationRequest,
  addRequestNote,
} from "../services/request.service";

const statusEnum = z.enum(["NEW", "IN_PROGRESS", "CONTACTED", "CONVERTED", "CLOSED"]);

const updateSchema = z.object({
  status: statusEnum.optional(),
  assignedToId: z.string().optional(),
  customerId: z.string().optional(),
});

const noteSchema = z.object({
  note: z.string().min(1, "متن یادداشت نمی‌تواند خالی باشد"),
});

export async function listRequestsHandler(req: Request, res: Response) {
  const statusQuery = req.query.status;
  const parsedStatus = statusEnum.safeParse(statusQuery);
  return res.json(
    await listConsultationRequests(parsedStatus.success ? { status: parsedStatus.data } : undefined),
  );
}

export async function getRequestHandler(req: Request, res: Response) {
  const request = await getConsultationRequestById(req.params.id);
  if (!request) return res.status(404).json({ message: "درخواست یافت نشد" });
  return res.json(request);
}

export async function updateRequestHandler(req: Request, res: Response) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  return res.json(await updateConsultationRequest(req.params.id, parsed.data));
}

export async function addNoteHandler(req: Request, res: Response) {
  const parsed = noteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "اطلاعات ورودی نامعتبر است", errors: parsed.error.flatten() });
  }
  const note = await addRequestNote(req.params.id, req.auth!.adminUserId, parsed.data.note);
  return res.status(201).json(note);
}
