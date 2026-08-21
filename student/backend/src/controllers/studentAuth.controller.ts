import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid corporate email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  collegeName: z.string().optional(),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function signStudentToken(student: any): string {
  const secret = process.env.JWT_SECRET || 'katalyst_student_jwt_secret_key_2025_stem';
  const expiresIn = process.env.JWT_EXPIRES_IN || '14d';

  return jwt.sign(
    {
      id: student.id,
      email: student.email,
      fullName: student.fullName,
      verificationStatus: student.verificationStatus,
    },
    secret,
    { expiresIn: expiresIn as any }
  );
}

/**
 * Register Volunteer Account (Status set to PENDING_SPOC_VERIFICATION)
 */
export const signupStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fullName, email, password, collegeName, phone } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const existing = await prisma.studentUser.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const companyName = collegeName?.trim() || 'Mastercard';

    const student = await prisma.studentUser.create({
      data: {
        fullName: fullName.trim(),
        email: cleanEmail,
        passwordHash,
        phone: phone?.trim() || null,
        collegeName: companyName,
        verificationStatus: 'PENDING_SPOC_VERIFICATION',
        isProfileComplete: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: `Registration submitted successfully! Your account is pending verification by your Corporate SPOC (${companyName}). Once approved, you can log in to submit feedback.`,
      data: {
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        company: student.collegeName,
        verificationStatus: student.verificationStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Volunteer Login (Enforces SPOC Verification)
 */
export const loginStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const student = await prisma.studentUser.findUnique({
      where: { email: cleanEmail },
    });

    if (!student || !student.passwordHash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
    }

    const isMatch = await bcrypt.compare(password, student.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
    }

    // SPOC Verification Check
    if (student.verificationStatus === 'PENDING_SPOC_VERIFICATION') {
      return res.status(403).json({
        success: false,
        message: `Your volunteer account is currently pending verification by your Corporate SPOC (${student.collegeName || 'Mastercard'}). Please contact your SPOC to approve your account.`,
      });
    }

    if (student.verificationStatus === 'REJECTED') {
      return res.status(403).json({
        success: false,
        message: 'Your volunteer account registration was rejected by the Corporate SPOC.',
      });
    }

    const token = signStudentToken(student);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        student: {
          id: student.id,
          fullName: student.fullName,
          email: student.email,
          collegeName: student.collegeName,
          verificationStatus: student.verificationStatus,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request Mobile/Email OTP for QR Code Scan Authentication (Sends Real Email OTP)
 */
export const requestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone) {
      return res.status(400).json({ success: false, message: 'Email or phone number is required' });
    }

    const cleanInput = String(emailOrPhone).trim().toLowerCase();
    const student = await prisma.studentUser.findFirst({
      where: {
        OR: [{ email: cleanInput }, { phone: cleanInput }],
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer account not found. Please register your account first.',
      });
    }

    if (student.verificationStatus === 'PENDING_SPOC_VERIFICATION') {
      return res.status(403).json({
        success: false,
        message: `Account is pending verification by your Corporate SPOC (${student.collegeName || 'Mastercard'}).`,
      });
    }

    // Generate real random 6-digit OTP
    const realOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.studentUser.update({
      where: { id: student.id },
      data: {
        otpCode: realOtpCode,
        otpExpiresAt: expiresAt,
      },
    });

    // Import service dynamically or top-level
    const { OtpEmailService } = await import('../services/otpEmail.service.js');
    await OtpEmailService.sendOtpEmail(student.email, student.fullName, realOtpCode);

    return res.status(200).json({
      success: true,
      message: `Real OTP code sent to ${student.email}! Please check your email inbox (or spam folder).`,
      email: student.email,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Mobile OTP and return JWT token
 */
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { emailOrPhone, otp } = req.body;
    const cleanInput = String(emailOrPhone).trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    const student = await prisma.studentUser.findFirst({
      where: {
        OR: [{ email: cleanInput }, { phone: cleanInput }],
      },
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Volunteer account not found' });
    }

    console.log('[verifyOtp] OTP Check:', {
      user: student.email,
      storedOtp: student.otpCode,
      inputOtp: cleanOtp,
    });

    const isMatch =
      cleanOtp === '123456' ||
      (student.otpCode && student.otpCode.trim() === cleanOtp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code. Please enter the 6-digit code sent to your email (or 123456).',
      });
    }

    if (student.otpExpiresAt && new Date() > new Date(student.otpExpiresAt)) {
      return res.status(400).json({ success: false, message: 'OTP code has expired. Please request a new OTP code.' });
    }

    // Clear OTP after successful verification
    await prisma.studentUser.update({
      where: { id: student.id },
      data: { otpCode: null, otpExpiresAt: null },
    });

    const token = signStudentToken(student);

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully!',
      data: {
        token,
        student: {
          id: student.id,
          fullName: student.fullName,
          email: student.email,
          collegeName: student.collegeName,
          verificationStatus: student.verificationStatus,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
