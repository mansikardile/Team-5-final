import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface StudentAuthPayload {
  id: string;
  email: string;
  fullName: string;
  isCollegeVerified: boolean;
  verificationStatus: string;
}

declare global {
  namespace Express {
    interface Request {
      student?: StudentAuthPayload;
    }
  }
}

export const authenticateStudentJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Student authentication token missing or invalid format',
    });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'katalyst_student_jwt_secret_key_2025_stem';

  try {
    const decoded = jwt.verify(token, secret) as StudentAuthPayload;
    req.student = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Student session expired or invalid. Please sign in again.',
    });
  }
};

export const optionalStudentJwt = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'katalyst_student_jwt_secret_key_2025_stem';
    try {
      const decoded = jwt.verify(token, secret) as StudentAuthPayload;
      req.student = decoded;
    } catch (error) {
      // ignore invalid optional token
    }
  }

  next();
};
