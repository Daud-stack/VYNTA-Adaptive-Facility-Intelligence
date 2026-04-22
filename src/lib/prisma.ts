import { PrismaNeonHttp } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL;

const adapter = connectionString
  ? new PrismaNeonHttp(connectionString, {})
  : undefined;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(adapter ? { adapter } : undefined);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
