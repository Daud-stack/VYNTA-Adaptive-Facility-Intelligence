import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const dbUrl = "postgresql://neondb_owner:npg_tWgV4DJp5lAK@ep-cool-water-ab6tdqbq-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require";

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!globalForPrisma.prisma) {
      const pool = new Pool({ connectionString: dbUrl });
      // @ts-ignore
      const adapter = new PrismaPg(pool);
      globalForPrisma.prisma = new PrismaClient({ adapter });
    }
    return (globalForPrisma.prisma as any)[prop];
  }
});

export const getPrismaClient = () => prisma;
