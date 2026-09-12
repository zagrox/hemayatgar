import { prisma } from "@hemayatgar/database";

export function listMediaFiles() {
  return prisma.mediaFile.findMany({ orderBy: { createdAt: "desc" } });
}

export function createMediaFile(input: {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
  sizeInBytes?: number;
  uploadedById?: string;
}) {
  return prisma.mediaFile.create({ data: input });
}

export function deleteMediaFile(id: string) {
  return prisma.mediaFile.delete({ where: { id } });
}
