import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { prisma } from "@hemayatgar/database";
import { env } from "../config/env";

export interface AuthTokenPayload {
  adminUserId: string;
  roleId: string;
  roleName: string;
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("ایمیل یا رمز عبور اشتباه است");
    this.name = "InvalidCredentialsError";
  }
}

export class InactiveAccountError extends Error {
  constructor() {
    super("این حساب کاربری غیرفعال شده است");
    this.name = "InactiveAccountError";
  }
}

export class InvalidResetTokenError extends Error {
  constructor() {
    super("لینک بازیابی نامعتبر یا منقضی شده است");
    this.name = "InvalidResetTokenError";
  }
}

export async function login(email: string, password: string) {
  const adminUser = await prisma.adminUser.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!adminUser) {
    throw new InvalidCredentialsError();
  }

  if (!adminUser.isActive) {
    throw new InactiveAccountError();
  }

  const isPasswordValid = await bcrypt.compare(password, adminUser.passwordHash);
  if (!isPasswordValid) {
    throw new InvalidCredentialsError();
  }

  const payload: AuthTokenPayload = {
    adminUserId: adminUser.id,
    roleId: adminUser.roleId,
    roleName: adminUser.role.name,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

  await prisma.adminUser.update({
    where: { id: adminUser.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    token,
    user: {
      id: adminUser.id,
      fullName: adminUser.fullName,
      email: adminUser.email,
      avatarUrl: adminUser.avatarUrl,
      role: { id: adminUser.role.id, name: adminUser.role.name, label: adminUser.role.label },
    },
  };
}

export async function hashPassword(plainPassword: string) {
  const saltRounds = 12;
  return bcrypt.hash(plainPassword, saltRounds);
}

export async function getAdminUserById(adminUserId: string) {
  return prisma.adminUser.findUnique({
    where: { id: adminUserId },
    include: { role: true },
  });
}

/**
 * یک توکن یک‌بارمصرف برای بازیابی رمز عبور می‌سازد (اعتبار: ۱ ساعت).
 * اگر ایمیل در سیستم نباشد، عمداً چیزی برنمی‌گرداند تا کسی نتواند حدس بزند
 * چه ایمیل‌هایی در سیستم ثبت شده‌اند.
 */
export async function requestPasswordReset(email: string) {
  const adminUser = await prisma.adminUser.findUnique({ where: { email } });
  if (!adminUser) return null;

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.adminUser.update({
    where: { id: adminUser.id },
    data: { resetPasswordToken: token, resetPasswordExpiresAt: expiresAt },
  });

  return { token, fullName: adminUser.fullName };
}

export async function resetPasswordWithToken(token: string, newPassword: string) {
  const adminUser = await prisma.adminUser.findUnique({ where: { resetPasswordToken: token } });

  if (!adminUser || !adminUser.resetPasswordExpiresAt || adminUser.resetPasswordExpiresAt < new Date()) {
    throw new InvalidResetTokenError();
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.adminUser.update({
    where: { id: adminUser.id },
    data: { passwordHash, resetPasswordToken: null, resetPasswordExpiresAt: null },
  });
}
