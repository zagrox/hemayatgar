import { prisma } from "@hemayatgar/database";

export function listSliderItems() {
  return prisma.sliderItem.findMany({ orderBy: { order: "asc" } });
}

export function createSliderItem(input: {
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  order?: number;
}) {
  return prisma.sliderItem.create({ data: input });
}

export function updateSliderItem(
  id: string,
  input: Partial<{ title: string; subtitle: string; imageUrl: string; linkUrl: string; order: number; isActive: boolean }>,
) {
  return prisma.sliderItem.update({ where: { id }, data: input });
}

export function deleteSliderItem(id: string) {
  return prisma.sliderItem.delete({ where: { id } });
}
