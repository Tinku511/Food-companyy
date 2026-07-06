import { defineConfig, env } from 'prisma/config';

// prisma.config.ts — Prisma v7 configuration file
// Replaces the `url` field that was previously in prisma/schema.prisma.
// The DATABASE_URL is injected via:
//   - `dotenv-cli` for Prisma CLI commands (npm run db:generate / db:migrate / etc.)
//   - Next.js automatically for the runtime app (reads .env.local)

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
