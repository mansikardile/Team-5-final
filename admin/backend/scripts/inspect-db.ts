import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const tables: any[] = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  console.log('Current Tables in Supabase:', tables.map(t => t.table_name));

  const adminCount = await prisma.admin.count();
  const userCount = await prisma.studentUser.count();
  const eventCount = await prisma.event.count();
  const feedbackCount = await prisma.volunteerFeedback.count();

  console.log({
    adminCount,
    userCount,
    eventCount,
    feedbackCount
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
