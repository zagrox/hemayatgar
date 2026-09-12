import { prisma } from "@hemayatgar/database";

export async function getSiteSettings() {
  const existing = await prisma.siteSetting.findFirst();
  if (existing) return existing;
  return prisma.siteSetting.create({ data: {} });
}

export async function updateSiteSettings(input: Record<string, unknown>) {
  const existing = await getSiteSettings();
  return prisma.siteSetting.update({ where: { id: existing.id }, data: input });
}
