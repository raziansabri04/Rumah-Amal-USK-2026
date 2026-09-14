import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || '';
const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrismaInstance(): PrismaClient {
  if (
    globalForPrisma.prisma &&
    (!(globalForPrisma.prisma as any).program ||
      !(globalForPrisma.prisma as any).news ||
      !(globalForPrisma.prisma as any).banner ||
      !(globalForPrisma.prisma as any).newsLink ||
      !(globalForPrisma.prisma as any).muzakki ||
      !(globalForPrisma.prisma as any)._likesCountRefreshed)
  ) {
    globalForPrisma.prisma = undefined;
  }

  if (!globalForPrisma.prisma) {
    try {
      Object.keys(require.cache).forEach((key) => {
        if (key.includes('@prisma/client') || key.includes('.prisma')) {
          delete require.cache[key];
        }
      });
    } catch {
      // ignore
    }
    const FreshPrismaClient = require('@prisma/client').PrismaClient;
    const clientInstance = new FreshPrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
    (clientInstance as any)._likesCountRefreshed = true;
    globalForPrisma.prisma = clientInstance;
  }
  return globalForPrisma.prisma!;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    let client = getPrismaInstance();
    if (
      typeof prop === 'string' &&
      !(prop in client) &&
      !['then', 'catch', 'finally', 'toJSON', 'toString'].includes(prop)
    ) {
      globalForPrisma.prisma = undefined;
      client = getPrismaInstance();
    }
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

export default prisma;
