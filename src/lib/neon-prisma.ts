import { PrismaClient } from '@/generated/neon-client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForNeon = globalThis as unknown as {
  neonPool: Pool | undefined;
  neonPrisma: PrismaClient | undefined;
};

function getNeonPool(): Pool {
  if (!globalForNeon.neonPool) {
    const rawUrl = process.env.NEON_DATABASE_URL || process.env.NEON_DIRECT_URL || '';
    let cleanUrl = rawUrl;
    try {
      const parsed = new URL(rawUrl);
      parsed.searchParams.delete('channel_binding');
      parsed.searchParams.set('sslmode', 'verify-full');
      cleanUrl = parsed.toString();
    } catch {
      cleanUrl = rawUrl.replace(/channel_binding=[^&]*&?/g, '');
    }

    globalForNeon.neonPool = new Pool({
      connectionString: cleanUrl,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
    });

    globalForNeon.neonPool.on('error', (err) => {
      console.error('[Neon PG Pool Idle Client Error]', err);
    });
  }
  return globalForNeon.neonPool;
}

export function getNeonPrismaInstance(): PrismaClient {
  if (!globalForNeon.neonPrisma) {
    const pool = getNeonPool();
    const adapter = new PrismaPg(pool);
    globalForNeon.neonPrisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
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
