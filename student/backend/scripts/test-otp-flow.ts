import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function main() {
  const email = 'aniket.d@mastercard.com';

  console.log('1. Requesting OTP for:', email);
  const reqRes = await axios.post('http://localhost:5001/api/auth/request-otp', { emailOrPhone: email });
  console.log('API Request Response:', reqRes.data);

  // Read stored OTP from DB
  const user = await prisma.studentUser.findUnique({ where: { email } });
  console.log('2. Stored OTP Code in PostgreSQL DB:', user?.otpCode);

  if (!user?.otpCode) {
    throw new Error('No OTP code saved in DB');
  }

  // Verify OTP
  console.log('3. Verifying OTP Code:', user.otpCode);
  const verRes = await axios.post('http://localhost:5001/api/auth/verify-otp', {
    emailOrPhone: email,
    otp: user.otpCode,
  });

  console.log('🎉 OTP Verification Result:', verRes.data);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
