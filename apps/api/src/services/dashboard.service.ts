import { prisma } from "@hemayatgar/database";

export async function getDashboardStats() {
  const [
    totalRequests,
    newRequests,
    totalCustomers,
    totalArticles,
    publishedArticles,
    totalInsuranceCategories,
  ] = await Promise.all([
    prisma.consultationRequest.count(),
    prisma.consultationRequest.count({ where: { status: "NEW" } }),
    prisma.customer.count(),
    prisma.article.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.insuranceCategory.count({ where: { isActive: true } }),
  ]);

  const recentRequests = await prisma.consultationRequest.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { insuranceCategory: { select: { title: true } } },
  });

  return {
    totalRequests,
    newRequests,
    totalCustomers,
    totalArticles,
    publishedArticles,
    totalInsuranceCategories,
    recentRequests,
  };
}
