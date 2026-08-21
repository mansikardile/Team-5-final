import { StudentVerificationStatus } from '@prisma/client';

export const APPROVED_COLLEGE_DOMAINS = [
  'coep.ac.in',
  'coeptech.ac.in',
  'vjti.ac.in',
  'iitb.ac.in',
  'vit.edu',
  'pict.edu',
  'mitwpu.edu.in',
  'spit.ac.in',
  'rvce.edu.in',
  'bmsce.ac.in',
  'dtu.ac.in',
  'nsut.ac.in',
  'iiit.ac.in',
  'nitk.edu.in',
  'vnit.ac.in',
  'cumminscollege.in',
  'iitd.ac.in',
  'iitm.ac.in',
  'iitr.ac.in',
  'iitkgp.ac.in',
  'iiitd.ac.in',
  'pec.edu.in',
  'sndt.ac.in',
  'banasthali.org',
  'igdtuw.ac.in',
];

export interface DomainVerificationResult {
  domain: string;
  isCollegeVerified: boolean;
  verificationStatus: StudentVerificationStatus;
  institutionHint?: string;
}

export function verifyStudentEmailDomain(email: string): DomainVerificationResult {
  const parts = email.toLowerCase().trim().split('@');
  if (parts.length !== 2) {
    return {
      domain: '',
      isCollegeVerified: false,
      verificationStatus: StudentVerificationStatus.GENERAL_STUDENT,
    };
  }

  const domain = parts[1];

  // 1. Direct match on approved partner college domain
  if (APPROVED_COLLEGE_DOMAINS.includes(domain)) {
    return {
      domain,
      isCollegeVerified: true,
      verificationStatus: StudentVerificationStatus.VERIFIED_COLLEGE,
      institutionHint: getInstitutionNameFromDomain(domain),
    };
  }

  // 2. Unlisted academic/educational domain
  if (
    domain.endsWith('.ac.in') ||
    domain.endsWith('.edu') ||
    domain.endsWith('.edu.in')
  ) {
    return {
      domain,
      isCollegeVerified: false,
      verificationStatus: StudentVerificationStatus.PENDING_VERIFICATION,
    };
  }

  // 3. Standard general email
  return {
    domain,
    isCollegeVerified: false,
    verificationStatus: StudentVerificationStatus.GENERAL_STUDENT,
  };
}

function getInstitutionNameFromDomain(domain: string): string {
  const map: Record<string, string> = {
    'coep.ac.in': 'College of Engineering Pune (COEP)',
    'coeptech.ac.in': 'COEP Technological University',
    'vjti.ac.in': 'Veermata Jijabai Technological Institute (VJTI Mumbai)',
    'iitb.ac.in': 'Indian Institute of Technology Bombay',
    'vit.edu': 'Vishwakarma Institute of Technology Pune',
    'pict.edu': 'Pune Institute of Computer Technology (PICT)',
    'cumminscollege.in': 'MKSSS Cummins College of Engineering for Women',
    'igdtuw.ac.in': 'Indira Gandhi Delhi Technical University for Women',
    'banasthali.org': 'Banasthali Vidyapith',
    'dtu.ac.in': 'Delhi Technological University (DTU)',
    'nsut.ac.in': 'Netaji Subhas University of Technology (NSUT)',
    'rvce.edu.in': 'R.V. College of Engineering Bangalore',
    'bmsce.ac.in': 'BMS College of Engineering',
    'spit.ac.in': 'Sardar Patel Institute of Technology',
  };
  return map[domain] || 'Recognized Partner Institution';
}
