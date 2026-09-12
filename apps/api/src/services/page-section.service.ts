import { prisma } from "@hemayatgar/database";
import type { PageSectionType, Prisma } from "@hemayatgar/database";

export function listPageSections(pageSlug: string, activeOnly = false) {
  return prisma.pageSection.findMany({
    where: { pageSlug, ...(activeOnly ? { isActive: true } : {}) },
    orderBy: { order: "asc" },
  });
}

export async function createPageSection(input: {
  pageSlug: string;
  type: PageSectionType;
  content: Prisma.InputJsonValue;
  order?: number;
}) {
  const order = input.order ?? (await prisma.pageSection.count({ where: { pageSlug: input.pageSlug } }));
  return prisma.pageSection.create({ data: { ...input, order } });
}

export function updatePageSection(
  id: string,
  input: Partial<{ content: Prisma.InputJsonValue; order: number; isActive: boolean }>,
) {
  return prisma.pageSection.update({ where: { id }, data: input });
}

export function deletePageSection(id: string) {
  return prisma.pageSection.delete({ where: { id } });
}

export async function reorderPageSections(pageSlug: string, orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.pageSection.update({ where: { id }, data: { order: index } }),
    ),
  );
  return listPageSections(pageSlug);
}
