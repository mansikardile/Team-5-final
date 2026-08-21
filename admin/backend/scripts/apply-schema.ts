import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Syncing new SevaSahayog database columns...');

  const sqls = [
    `ALTER TABLE "student_users" ADD COLUMN IF NOT EXISTS "verificationStatus" TEXT NOT NULL DEFAULT 'VERIFIED';`,
    `ALTER TABLE "student_users" ADD COLUMN IF NOT EXISTS "verifiedById" TEXT;`,
    `ALTER TABLE "student_users" ADD COLUMN IF NOT EXISTS "otpCode" TEXT;`,
    `ALTER TABLE "student_users" ADD COLUMN IF NOT EXISTS "otpExpiresAt" TIMESTAMP(3);`,
    `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "aiExecutiveSummary" TEXT;`,
    `ALTER TABLE "volunteer_feedbacks" ADD COLUMN IF NOT EXISTS "language" TEXT NOT NULL DEFAULT 'en';`,
    `ALTER TABLE "volunteer_feedbacks" ADD COLUMN IF NOT EXISTS "translatedExperience" TEXT;`,
    `ALTER TABLE "volunteer_feedbacks" ADD COLUMN IF NOT EXISTS "translatedSuggestion" TEXT;`,
    `ALTER TABLE "admins" ADD COLUMN IF NOT EXISTS "company" TEXT DEFAULT 'SevaSahayog';`,
  ];

  for (const q of sqls) {
    try {
      await prisma.$executeRawUnsafe(q);
      console.log('✅ Applied:', q);
    } catch (e: any) {
      console.warn('Notice applying column:', e?.message);
    }
  }

  console.log('🎉 Database Schema Columns Synced Successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
