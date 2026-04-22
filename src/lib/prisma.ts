import { PrismaNeonHttp } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const connectionString = process.env.DATABASE_URL;

export function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const adapter = connectionString
    ? new PrismaNeonHttp(connectionString, {})
    : undefined;

  const prisma = new PrismaClient(adapter ? { adapter } : undefined);

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }

  return prisma;
}
