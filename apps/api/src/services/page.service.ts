import { prisma } from "@hemayatgar/database";

export function listPages() {
  return prisma.page.findMany({ orderBy: { updatedAt: "desc" } });
}

export function getPageBySlug(slug: string) {
  return prisma.page.findUnique({ where: { slug }, include: { faqs: true } });
}

export function createPage(input: {
  slug: string;
  title: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
}) {
  return prisma.page.create({ data: input });
}

export function updatePage(id: string, input: Partial<{
  title: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
}>) {
  return prisma.page.update({ where: { id }, data: input });
}

export function deletePage(id: string) {
  return prisma.page.delete({ where: { id } });
}
