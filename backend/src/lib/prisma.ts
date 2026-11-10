import { PrismaClient } from "@prisma/client";

// Singleton pattern supaya hot-reload (tsx watch) tidak membuka koneksi baru berulang kali.
declare global {
  // eslint-disable-next-line no-var
  var __lumoraPrisma: PrismaClient | undefined;
}

export const prisma = global.__lumoraPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__lumoraPrisma = prisma;
}
