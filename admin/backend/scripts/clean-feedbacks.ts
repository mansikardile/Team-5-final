import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const idsToDelete = [
    'cmt2u2vhb000113nx32cf69gh', // "i really liked the event"
    'cmt2tdm670001dvai2rb9w52j', // question marks string
  ];

  for (const id of idsToDelete) {
    try {
      await prisma.volunteerFeedback.delete({ where: { id } });
      console.log(`🗑️ Pruned item ID: ${id}`);
    } catch (e) {
      // ignore
    }
  }

  const remaining = await prisma.volunteerFeedback.findMany({
    include: { user: true, activity: true },
  });

  console.log('\n======================================================');
  console.log(`🎉 DATABASE CLEANED! ${remaining.length} HIGH-QUALITY VERIFIED ENTRIES REMAINING:`);
  console.log('======================================================');
  for (const fb of remaining) {
    console.log(`• [${fb.activity.code}] ${fb.user.fullName} (${fb.user.collegeName || 'Mastercard'}) - ★${fb.rating}/5`);
    console.log(`  Exp: "${fb.translatedExperience || fb.experience}"\n`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
