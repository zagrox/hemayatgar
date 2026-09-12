import { prisma } from "@hemayatgar/database";

export function listFaqItems(filter?: { pageId?: string; insuranceCategoryId?: string; insuranceSubsectionId?: string }) {
  return prisma.faqItem.findMany({ where: filter, orderBy: { order: "asc" } });
}

export function createFaqItem(input: {
  question: string;
  answer: string;
  order?: number;
  isGlobal?: boolean;
  pageId?: string;
  insuranceCategoryId?: string;
  insuranceSubsectionId?: string;
}) {
  return prisma.faqItem.create({ data: input });
}

export function updateFaqItem(
  id: string,
  input: Partial<{ question: string; answer: string; order: number; isGlobal: boolean }>,
) {
  return prisma.faqItem.update({ where: { id }, data: input });
}

export function deleteFaqItem(id: string) {
  return prisma.faqItem.delete({ where: { id } });
}
