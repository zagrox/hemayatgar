import bcrypt from "bcrypt";
import { prisma } from "@hemayatgar/database";
import { hashPassword } from "./auth.service";

export class WrongCurrentPasswordError extends Error {
  constructor() {
    super("رمز عبور فعلی اشتباه است");
    this.name = "WrongCurrentPasswordError";
  }
}

export async function updateOwnProfile(
  adminUserId: string,
  input: { fullName?: string; mobile?: string; avatarUrl?: string },
) {
  return prisma.adminUser.update({ where: { id: adminUserId }, data: input });
}

export async function changeOwnPassword(
  adminUserId: string,
  currentPassword: string,
  newPassword: string,
) {
  const adminUser = await prisma.adminUser.findUniqueOrThrow({ where: { id: adminUserId } });
  const isValid = await bcrypt.compare(currentPassword, adminUser.passwordHash);
  if (!isValid) {
    throw new WrongCurrentPasswordError();
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.adminUser.update({ where: { id: adminUserId }, data: { passwordHash } });
}
