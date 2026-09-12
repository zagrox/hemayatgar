import { prisma } from "@hemayatgar/database";

export function listArticles() {
  return prisma.article.findMany({
    include: { category: true, author: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({ where: { slug }, include: { category: true } });
}

export function createArticle(input: {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  categoryId?: string;
  authorId?: string;
  seoTitle?: string;
  seoDescription?: string;
}) {
  return prisma.article.create({ data: input });
}

export function updateArticle(
  id: string,
  input: Partial<{
    title: string;
    excerpt: string;
    content: string;
    coverImageUrl: string;
    categoryId: string;
    status: "DRAFT" | "PUBLISHED";
    seoTitle: string;
    seoDescription: string;
    publishedAt: Date;
  }>,
) {
  return prisma.article.update({ where: { id }, data: input });
}

export function deleteArticle(id: string) {
  return prisma.article.delete({ where: { id } });
}

export function listArticleCategories() {
  return prisma.articleCategory.findMany({ orderBy: { title: "asc" } });
}

export function createArticleCategory(input: { slug: string; title: string }) {
  return prisma.articleCategory.create({ data: input });
}
