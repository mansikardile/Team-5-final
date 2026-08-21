import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "student_users" ALTER COLUMN "verificationStatus" TYPE TEXT USING "verificationStatus"::TEXT;`
  );
  await prisma.$executeRawUnsafe(
    `UPDATE "student_users" SET "verificationStatus" = 'VERIFIED';`
  );
  console.log('✅ Updated student_users verificationStatus column to TEXT and set values to VERIFIED');
}

main().finally(() => prisma.$disconnect());
