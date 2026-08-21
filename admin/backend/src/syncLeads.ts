import { prisma } from './lib/prisma.js';
import { LeadStatus } from '@prisma/client';

async function main() {
  const regs = await prisma.sessionRegistration.findMany({
    include: { student: true, event: true },
  });

  console.log(`Found ${regs.length} session registrations:`);
  for (const r of regs) {
    console.log(`- Student: ${r.student.fullName} (${r.student.email}), Event: ${r.event.title} (${r.event.code}), Tracking: ${r.trackingId}`);

    // Ensure corresponding StudentLead exists
    const existingLead = await prisma.studentLead.findFirst({
      where: {
        OR: [
          { trackingId: r.trackingId },
          { email: r.student.email, eventId: r.eventId },
        ],
      },
    });

    if (!existingLead) {
      console.log(`  -> Creating missing StudentLead for ${r.student.fullName}...`);
      await prisma.studentLead.create({
        data: {
          trackingId: r.trackingId,
          fullName: r.student.fullName,
          email: r.student.email,
          phone: r.student.phone || 'N/A',
          college: r.student.collegeName || r.event.collegeName,
          yearOfStudy: r.student.yearOfStudy || 'Undergraduate STEM',
          fieldOfStudy: r.student.branch || 'Engineering',
          eventId: r.eventId,
          status: LeadStatus.REGISTERED,
        },
      });
    } else {
      console.log(`  -> StudentLead already exists (ID: ${existingLead.id})`);
    }
  }

  const allLeads = await prisma.studentLead.findMany();
  console.log(`\n✅ Total Student Leads in DB now: ${allLeads.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
