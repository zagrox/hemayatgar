import { prisma } from "@hemayatgar/database";
import type { RequestStatus } from "@hemayatgar/database";
import { createNewRequestNotification } from "./notification.service";

export async function createConsultationRequest(input: {
  fullName: string;
  mobile: string;
  insuranceCategoryId?: string;
  description?: string;
}) {
  const request = await prisma.consultationRequest.create({ data: input });
  await createNewRequestNotification(request.id, request.fullName);
  return request;
}

export function listConsultationRequests(filter?: { status?: RequestStatus }) {
  return prisma.consultationRequest.findMany({
    where: filter,
    include: {
      insuranceCategory: { select: { title: true } },
      assignedTo: { select: { fullName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function getConsultationRequestById(id: string) {
  return prisma.consultationRequest.findUnique({
    where: { id },
    include: {
      insuranceCategory: { select: { title: true } },
      assignedTo: { select: { fullName: true } },
      notes: { include: { adminUser: { select: { fullName: true } } }, orderBy: { createdAt: "desc" } },
      customer: true,
    },
  });
}

export function updateConsultationRequest(
  id: string,
  input: Partial<{ status: RequestStatus; assignedToId: string; customerId: string }>,
) {
  return prisma.consultationRequest.update({ where: { id }, data: input });
}

export function addRequestNote(requestId: string, adminUserId: string, note: string) {
  return prisma.requestNote.create({ data: { requestId, adminUserId, note } });
}
