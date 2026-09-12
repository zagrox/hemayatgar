import { prisma } from "@hemayatgar/database";

export function listInsuranceCategories() {
  return prisma.insuranceCategory.findMany({
    orderBy: { order: "asc" },
    include: { subsections: { orderBy: { order: "asc" } } },
  });
}

export function getInsuranceCategoryBySlug(slug: string) {
  return prisma.insuranceCategory.findUnique({
    where: { slug },
    include: {
      subsections: { orderBy: { order: "asc" }, include: { faqs: true } },
      faqs: true,
    },
  });
}

export function createInsuranceCategory(input: {
  slug: string;
  title: string;
  shortDescription?: string;
  icon?: string;
  heroImageUrl?: string;
  order?: number;
  seoTitle?: string;
  seoDescription?: string;
}) {
  return prisma.insuranceCategory.create({ data: input });
}

export function updateInsuranceCategory(
  id: string,
  input: Partial<{
    title: string;
    shortDescription: string;
    icon: string;
    heroImageUrl: string;
    order: number;
    isActive: boolean;
    seoTitle: string;
    seoDescription: string;
  }>,
) {
  return prisma.insuranceCategory.update({ where: { id }, data: input });
}

export function deleteInsuranceCategory(id: string) {
  return prisma.insuranceCategory.delete({ where: { id } });
}
