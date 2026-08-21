import { prisma } from './lib/prisma.js';

async function main() {
  console.log('Adding missing columns to student_leads in Supabase PostgreSQL...');
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "student_leads" 
    ADD COLUMN IF NOT EXISTS "signatureDataUrl" TEXT,
    ADD COLUMN IF NOT EXISTS "syncedFromOffline" BOOLEAN DEFAULT false;
  `);
  console.log('✅ Columns added successfully to Supabase!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
