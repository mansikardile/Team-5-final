import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

export const getTechLabs = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const labs = await prisma.techLab.findMany({
      where: { isLive: true },
      orderBy: { createdAt: 'asc' },
    });

    return res.status(200).json({
      success: true,
      data: labs,
    });
  } catch (error) {
    next(error);
  }
};
