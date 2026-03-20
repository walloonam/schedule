import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const sqlitePath = databaseUrl.startsWith("file:")
  ? path.resolve(process.cwd(), databaseUrl.replace(/^file:/, ""))
  : databaseUrl;
const adapter = new PrismaBetterSqlite3({ url: sqlitePath });

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
