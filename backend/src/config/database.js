const { PrismaClient } = require('@prisma/client');

// Supabase uses PgBouncer which is incompatible with Prisma's named prepared statements.
// Appending ?pgbouncer=true disables them and resolves error 42P05.
function buildUrl() {
  const url = process.env.DATABASE_URL || '';
  if (!url || url.includes('pgbouncer=true')) return url;
  return url + (url.includes('?') ? '&' : '?') + 'pgbouncer=true';
}

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ datasourceUrl: buildUrl() });
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      datasourceUrl: buildUrl(),
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.__prisma;
}

module.exports = prisma;
