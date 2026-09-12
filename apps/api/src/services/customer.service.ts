import { prisma } from "@hemayatgar/database";

export function listCustomers(search?: string) {
  return prisma.customer.findMany({
    where: search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { mobile: { contains: search } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { _count: { select: { requests: true, interactions: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function getCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      requests: { orderBy: { createdAt: "desc" } },
      interactions: {
        orderBy: { createdAt: "desc" },
        include: { createdBy: { select: { fullName: true } } },
      },
    },
  });
}

export function createCustomer(input: { fullName: string; mobile: string; email?: string; notes?: string }) {
  return prisma.customer.create({ data: input });
}

export function updateCustomer(
  id: string,
  input: Partial<{ fullName: string; email: string; notes: string }>,
) {
  return prisma.customer.update({ where: { id }, data: input });
}

export function deleteCustomer(id: string) {
  return prisma.customer.delete({ where: { id } });
}

export function addCustomerInteraction(
  customerId: string,
  input: { type: "CALL" | "MEETING" | "WHATSAPP" | "NOTE" | "OTHER"; description: string; createdById?: string },
) {
  return prisma.customerInteraction.create({ data: { customerId, ...input } });
}
