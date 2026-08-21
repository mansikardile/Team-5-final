import { PrismaClient, ScholarshipApplicationStatus, MentorshipStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding initial Katalyst Mentors and Tech Labs...');

  // Seed Corporate Mentors
  const mentors = [
    {
      name: 'Dr. Radhika Sen',
      company: 'Google',
      roleTitle: 'Staff Software Engineer & Tech Lead',
      expertise: 'Distributed Systems, Cloud Architecture, Scalability',
      experienceYrs: 12,
      bio: 'Leading Google Cloud storage infrastructure teams. Passionate about guiding young female engineers through code reviews, design interviews, and system architecture.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      linkedinUrl: 'https://linkedin.com',
      isAvailable: true,
    },
    {
      name: 'Sneha Chawla',
      company: 'Mastercard',
      roleTitle: 'Director of Engineering - Cyber & Intelligence',
      expertise: 'Cybersecurity, Payment Protocols, AI Fraud Detection',
      experienceYrs: 10,
      bio: 'Directing real-time fraud mitigation engines at Mastercard. Dedicated mentor helping undergraduate scholars build strong project portfolios and secure top corporate internships.',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      linkedinUrl: 'https://linkedin.com',
      isAvailable: true,
    },
    {
      name: 'Pooja Subramanian',
      company: 'Microsoft',
      roleTitle: 'Principal Applied Scientist',
      expertise: 'Generative AI, NLP, Machine Learning Research',
      experienceYrs: 9,
      bio: 'Building foundational AI models at Microsoft Research. Mentoring women in STEM on technical research papers, algorithmic problem solving, and graduate fellowships.',
      avatarUrl: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=300&auto=format&fit=crop&q=80',
      linkedinUrl: 'https://linkedin.com',
      isAvailable: true,
    },
    {
      name: 'Aditi Nair',
      company: 'IBM Research',
      roleTitle: 'Lead Quantum & Cloud Specialist',
      expertise: 'Cloud Platforms, Full-Stack Architecture, DevOps',
      experienceYrs: 8,
      bio: 'Former Katalyst Scholar alumnus! Empowering undergraduate students to ace coding interviews and transition confidently into corporate tech leadership.',
      avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80',
      linkedinUrl: 'https://linkedin.com',
      isAvailable: true,
    },
  ];

  for (const m of mentors) {
    const existing = await prisma.mentor.findFirst({ where: { name: m.name } });
    if (!existing) {
      await prisma.mentor.create({ data: m });
    }
  }

  // Seed Tech Labs & Bootcamps
  const labs = [
    {
      title: 'Data Structures & Algorithms Mastery Bootcamp',
      category: 'DSA & Coding',
      instructor: 'Dr. Radhika Sen (Google)',
      durationHrs: 30,
      totalModules: 12,
      description: 'Master binary trees, dynamic programming, graphs, and LeetCode patterns required for Tier-1 software engineering interviews.',
      level: 'Intermediate to Advanced',
      bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      syllabus: 'Arrays, Two Pointers, Linked Lists, Trees, Graphs, DP, System Design Fundamentals',
      isLive: true,
    },
    {
      title: 'Full-Stack Modern Web & Cloud Deployment',
      category: 'Full-Stack & Cloud',
      instructor: 'Aditi Nair (IBM)',
      durationHrs: 24,
      totalModules: 8,
      description: 'Hands-on project building with Next.js, Node.js, PostgreSQL, Docker, and AWS serverless architecture.',
      level: 'Beginner to Intermediate',
      bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      syllabus: 'REST APIs, React Components, SQL DB Design, Authentication, Docker & CI/CD',
      isLive: true,
    },
    {
      title: 'AI & Data Intelligence Foundations',
      category: 'Artificial Intelligence',
      instructor: 'Pooja Subramanian (Microsoft)',
      durationHrs: 20,
      totalModules: 6,
      description: 'Introduction to neural networks, Transformer architectures, and building production-ready LLM agents.',
      level: 'All Levels',
      bannerUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
      syllabus: 'Python for AI, Vector DBs, Fine-tuning, LangChain, RAG Pipelines',
      isLive: true,
    },
    {
      title: 'Executive Resume & Technical Mock Interview Lab',
      category: 'Career & Leadership',
      instructor: 'Sneha Chawla (Mastercard)',
      durationHrs: 15,
      totalModules: 5,
      description: '1:1 behavioral coaching, STAR method interview frameworks, and ATS-optimized technical resume structuring.',
      level: 'Pre-final & Final Year',
      bannerUrl: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=600&auto=format&fit=crop&q=80',
      syllabus: 'STAR Technique, Technical Resume Teardown, Salary Negotiation, Corporate Etiquette',
      isLive: true,
    },
  ];

  for (const l of labs) {
    const existing = await prisma.techLab.findFirst({ where: { title: l.title } });
    if (!existing) {
      await prisma.techLab.create({ data: l });
    }
  }

  console.log('✅ Katalyst Mentors & Tech Labs seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
