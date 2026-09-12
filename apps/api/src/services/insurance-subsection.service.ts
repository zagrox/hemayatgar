import { prisma } from "@hemayatgar/database";

export function createInsuranceSubsection(input: {
  categoryId: string;
  slug: string;
  title: string;
  order?: number;
  introduction: string;
  coverages: string;
  exclusions: string;
  benefits: string;
  imageUrl?: string;
  isStandalonePage?: boolean;
}) {
  return prisma.insuranceSubsection.create({ data: input });
}

export function updateInsuranceSubsection(
  id: string,
  input: Partial<{
    title: string;
    order: number;
    introduction: string;
    coverages: string;
    exclusions: string;
    benefits: string;
    imageUrl: string;
    isStandalonePage: boolean;
    isActive: boolean;
  }>,
) {
  return prisma.insuranceSubsection.update({ where: { id }, data: input });
}

export function deleteInsuranceSubsection(id: string) {
  return prisma.insuranceSubsection.delete({ where: { id } });
}
