import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Purging legacy Katalyst tables from Supabase PostgreSQL database...');

  const legacyTables = [
    'scholarship_applications',
    'mentorship_requests',
    'mentors',
    'tech_labs',
    'student_leads',
    'session_registrations',
  ];

  for (const table of legacyTables) {
    try {
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
      console.log(`🗑️ Dropped table: ${table}`);
    } catch (err: any) {
      console.warn(`Could not drop ${table}:`, err?.message);
    }
  }

  // Verify remaining tables in public schema
  const remainingTables: any[] = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;

  console.log('✨ Clean SevaSahayog Tables remaining in Supabase:', remainingTables.map((t) => t.table_name));
}

main()
  .catch((e) => {
    console.error('Error during purge:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
