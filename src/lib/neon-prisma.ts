import { PrismaClient } from '@/generated/neon-client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.NEON_DATABASE_URL || process.env.NEON_DIRECT_URL || '';
const adapter = new PrismaPg({ connectionString });

const globalForNeon = globalThis as unknown as {
  neonPrisma: PrismaClient | undefined;
};

export function getNeonPrismaInstance(): PrismaClient {
  if (!globalForNeon.neonPrisma) {
    globalForNeon.neonPrisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return globalForNeon.neonPrisma;
}

export const neonPrisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getNeonPrismaInstance();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

export default neonPrisma;
