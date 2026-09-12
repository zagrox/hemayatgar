import { prisma } from "@hemayatgar/database";
import { hashPassword } from "./auth.service";

export async function listAdminUsers() {
  return prisma.adminUser.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      mobile: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      role: { select: { id: true, name: true, label: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createAdminUser(input: {
  fullName: string;
  email: string;
  mobile?: string;
  password: string;
  roleId: string;
}) {
  const passwordHash = await hashPassword(input.password);
  return prisma.adminUser.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      mobile: input.mobile,
      passwordHash,
      roleId: input.roleId,
    },
  });
}

export async function updateAdminUser(
  id: string,
  input: Partial<{ fullName: string; mobile: string; roleId: string; isActive: boolean }>,
) {
  return prisma.adminUser.update({ where: { id }, data: input });
}

export async function listRoles() {
  return prisma.role.findMany({ select: { id: true, name: true, label: true } });
}
