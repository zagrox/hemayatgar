import type { Request, Response, NextFunction } from "express";
import { prisma } from "@hemayatgar/database";
import { hasPermission } from "../utils/permissions";

/**
 * بررسی می‌کند که نقش کاربر لاگین‌کرده مجوز لازم را دارد یا نه.
 * نقش SUPER_ADMIN با مجوز "*" همیشه دسترسی کامل دارد.
 */
export function authorize(requiredPermission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ message: "برای این عملیات باید وارد حساب کاربری شوید" });
    }

    const role = await prisma.role.findUnique({ where: { id: req.auth.roleId } });
    if (!role) {
      return res.status(403).json({ message: "دسترسی غیرمجاز" });
    }

    const permissions = role.permissions as string[];
    const hasAccess = hasPermission(permissions, requiredPermission);

    if (!hasAccess) {
      return res.status(403).json({ message: "شما مجوز انجام این عملیات را ندارید" });
    }

    next();
  };
}
