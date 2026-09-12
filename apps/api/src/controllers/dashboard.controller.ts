import type { Request, Response } from "express";
import { getDashboardStats } from "../services/dashboard.service";

export async function dashboardStatsHandler(_req: Request, res: Response) {
  const stats = await getDashboardStats();
  return res.json(stats);
}
