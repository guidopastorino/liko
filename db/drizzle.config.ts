import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Cargar .env y luego .env.local (local tiene prioridad)
config();
config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    'Falta DATABASE_URL. Añádela a .env o .env.local (connection string del pooler de Supabase).'
  );
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schemas',
  out: './db/migrations',
  dbCredentials: {
    url: databaseUrl,
  },
});
