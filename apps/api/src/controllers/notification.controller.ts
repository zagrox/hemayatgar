import type { Request, Response } from "express";
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  countUnreadNotifications,
} from "../services/notification.service";

export async function listNotificationsHandler(_req: Request, res: Response) {
  return res.json(await listNotifications());
}

export async function unreadCountHandler(_req: Request, res: Response) {
  return res.json({ count: await countUnreadNotifications() });
}

export async function markReadHandler(req: Request, res: Response) {
  return res.json(await markNotificationRead(req.params.id));
}

export async function markAllReadHandler(_req: Request, res: Response) {
  await markAllNotificationsRead();
  return res.json({ message: "همه اعلان‌ها خوانده‌شده علامت‌گذاری شدند" });
}
