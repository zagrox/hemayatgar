import { prisma } from "@hemayatgar/database";

export function listNotifications() {
  return prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
}

export function createNewRequestNotification(requestId: string, fullName: string) {
  return prisma.notification.create({
    data: {
      type: "NEW_REQUEST",
      message: `درخواست مشاوره جدید از طرف ${fullName} ثبت شد`,
      relatedRequestId: requestId,
    },
  });
}

export function markNotificationRead(id: string) {
  return prisma.notification.update({ where: { id }, data: { isRead: true } });
}

export function markAllNotificationsRead() {
  return prisma.notification.updateMany({ where: { isRead: false }, data: { isRead: true } });
}

export function countUnreadNotifications() {
  return prisma.notification.count({ where: { isRead: false } });
}
