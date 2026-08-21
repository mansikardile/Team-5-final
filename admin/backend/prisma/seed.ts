import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SevaSahayog Real-Time Database Setup & Seed...');

  // 1. Ensure volunteer_feedbacks table exists via raw SQL
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "volunteer_feedbacks" (
        "id" TEXT NOT NULL,
        "activityId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "experience" TEXT NOT NULL,
        "rating" INTEGER NOT NULL,
        "suggestion" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "volunteer_feedbacks_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "volunteer_feedbacks_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "volunteer_feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "student_users"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "volunteer_feedbacks_userId_activityId_key" ON "volunteer_feedbacks"("userId", "activityId");
    `);
    console.log('✅ Table "volunteer_feedbacks" verified / created in PostgreSQL');
  } catch (err: any) {
    console.warn('Notice creating table:', err?.message);
  }

  // 2. Admin Account
  const adminEmail = 'admin@sevasahayog.org';
  const plainPassword = 'SevaAdmin2026!';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(plainPassword, salt);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: 'SevaSahayog Operations Head',
      role: Role.SUPER_ADMIN,
    },
    create: {
      email: adminEmail,
      name: 'SevaSahayog Operations Head',
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log(`✅ Seva Admin: ${admin.email}`);

  // 3. Real Volunteering Activities (Events)
  const activitiesData = [
    {
      code: 'SEVA-PUNE-KIT-01',
      title: 'Samutkarsh: 500 School Science Kits Assembly',
      collegeName: 'Mastercard',
      location: 'Kothrud, Pune',
      eventDate: new Date('2026-08-21T10:00:00Z'),
      description: 'Corporate employee volunteering for packaging 500 science kits for municipal schools.',
    },
    {
      code: 'SEVA-MUM-DIGI-02',
      title: 'Digital Literacy & Coding Lab for Municipal School',
      collegeName: 'Barclays',
      location: 'Goregaon West, Mumbai',
      eventDate: new Date('2026-08-20T11:00:00Z'),
      description: 'Hands-on Scratch programming and digital safety mentorship with 8th grade students.',
    },
    {
      code: 'SEVA-PUNE-TREE-03',
      title: 'Punarvas: Urban Micro-Forest Plantation & Seed Balls',
      collegeName: 'TCS',
      location: 'Baner Hills, Pune',
      eventDate: new Date('2026-08-22T08:30:00Z'),
      description: 'Planting 300 native indigenous saplings to restore urban micro-forest biodiversity.',
    },
    {
      code: 'SEVA-NSK-TRIBAL-04',
      title: 'Vanyashala: Solar Study Lamp Distribution & Livelihood',
      collegeName: 'Cummins',
      location: 'Trimbakeshwar, Nashik',
      eventDate: new Date('2026-08-24T09:00:00Z'),
      description: 'Assembly and handover of 200 solar lamps for tribal students in un-electrified hamlets.',
    },
  ];

  const createdEvents: any[] = [];
  for (const act of activitiesData) {
    const event = await prisma.event.upsert({
      where: { code: act.code },
      update: { ...act },
      create: { ...act, createdById: admin.id },
    });
    createdEvents.push(event);
    console.log(`✅ Activity Seeded: ${event.code} (${event.title})`);
  }

  // 4. Real Corporate Volunteers (StudentUser model)
  const volunteersData = [
    {
      fullName: 'Aniket Deshmukh',
      email: 'aniket.d@mastercard.com',
      collegeName: 'Mastercard',
      passwordPlain: 'Volunteer@123',
    },
    {
      fullName: 'Pooja Sharma',
      email: 'pooja.sharma@mastercard.com',
      collegeName: 'Mastercard',
      passwordPlain: 'Volunteer@123',
    },
    {
      fullName: 'Rahul Kulkarni',
      email: 'rahul.k@barclays.com',
      collegeName: 'Barclays',
      passwordPlain: 'Volunteer@123',
    },
    {
      fullName: 'Sneha Patil',
      email: 'sneha.patil@tcs.com',
      collegeName: 'TCS',
      passwordPlain: 'Volunteer@123',
    },
    {
      fullName: 'Vikas Joshi',
      email: 'vikas.j@cummins.com',
      collegeName: 'Cummins',
      passwordPlain: 'Volunteer@123',
    },
  ];

  const createdUsers: any[] = [];
  for (const v of volunteersData) {
    const userPassHash = await bcrypt.hash(v.passwordPlain, 10);
    const user = await prisma.studentUser.upsert({
      where: { email: v.email },
      update: {
        fullName: v.fullName,
        collegeName: v.collegeName,
        passwordHash: userPassHash,
      },
      create: {
        fullName: v.fullName,
        email: v.email,
        collegeName: v.collegeName,
        passwordHash: userPassHash,
        isProfileComplete: true,
      },
    });
    createdUsers.push(user);
    console.log(`✅ Volunteer User Seeded: ${user.fullName} (${user.email})`);
  }

  // 5. Real Feedback Submissions with 3 features (experience, rating 1-5, suggestion)
  const feedbacksData = [
    {
      userEmail: 'aniket.d@mastercard.com',
      activityCode: 'SEVA-PUNE-KIT-01',
      rating: 5,
      experience: 'Seeing the municipal school children receive their science kits directly was profoundly impactful for our Mastercard engineering team. Assembly was very organized.',
      suggestion: 'Would love to conduct monthly mentoring sessions with the same school.',
    },
    {
      userEmail: 'pooja.sharma@mastercard.com',
      activityCode: 'SEVA-PUNE-KIT-01',
      rating: 5,
      experience: 'Packaging workflow was super structured. 500 kits completed within 2.5 hours smoothly with great facilitator support.',
      suggestion: 'Add a 3-minute video demonstration before the assembly line begins.',
    },
    {
      userEmail: 'rahul.k@barclays.com',
      activityCode: 'SEVA-MUM-DIGI-02',
      rating: 5,
      experience: 'SevaSahayog coordinators guided our Barclays volunteers seamlessly throughout the Scratch coding workshop. Kids were super enthusiastic.',
      suggestion: 'Arrange dual monitors if possible for the teacher demo lab.',
    },
    {
      userEmail: 'sneha.patil@tcs.com',
      activityCode: 'SEVA-PUNE-TREE-03',
      rating: 5,
      experience: 'Planting 300 native saplings at Baner Hills with TCS colleagues was rejuvenating and perfectly organized.',
      suggestion: 'Provide extra pairs of gardening gloves for volunteers.',
    },
    {
      userEmail: 'vikas.j@cummins.com',
      activityCode: 'SEVA-NSK-TRIBAL-04',
      rating: 4,
      experience: 'Assembly of solar lamps was great, but bus travel from Pune to Trimbakeshwar took 45 minutes longer due to morning highway traffic.',
      suggestion: 'Start the transit 30 minutes earlier next time to avoid congestion.',
    },
  ];

  for (const fb of feedbacksData) {
    const user = createdUsers.find((u) => u.email === fb.userEmail);
    const event = createdEvents.find((e) => e.code === fb.activityCode);

    if (user && event) {
      await prisma.volunteerFeedback.upsert({
        where: {
          userId_activityId: {
            userId: user.id,
            activityId: event.id,
          },
        },
        update: {
          rating: fb.rating,
          experience: fb.experience,
          suggestion: fb.suggestion,
        },
        create: {
          userId: user.id,
          activityId: event.id,
          rating: fb.rating,
          experience: fb.experience,
          suggestion: fb.suggestion,
        },
      });
      console.log(`✅ Feedback Seeded: ${user.fullName} -> ${event.code}`);
    }
  }

  console.log('🎉 SevaSahayog Real-Time Database Setup & Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
