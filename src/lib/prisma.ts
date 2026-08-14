import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// max:1 porque cada instância serverless só precisa de 1 conexão para o
// PgBouncer (que já faz o pooling de verdade do lado do Supabase); um timeout
// de conexão curto evita que uma função trave até o limite de execução da
// Vercel em vez de falhar rápido e permitir retry.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  connectionTimeoutMillis: 8000,
  idleTimeoutMillis: 10000,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
