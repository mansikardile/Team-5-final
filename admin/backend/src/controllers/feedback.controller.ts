import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

export const getAdminFeedbacks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { activityCode, partner, rating } = req.query;

    const where: any = {};
    if (activityCode) {
      where.activity = { code: String(activityCode).toUpperCase() };
    }
    if (partner && partner !== 'ALL') {
      where.activity = { ...where.activity, collegeName: String(partner) };
    }
    if (rating && rating !== 'ALL') {
      where.rating = Number(rating);
    }

    const feedbacks = await prisma.volunteerFeedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        activity: {
          select: {
            id: true,
            code: true,
            title: true,
            collegeName: true,
            eventDate: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            collegeName: true,
          },
        },
      },
    });

    const formatted = feedbacks.map((f) => ({
      id: f.id,
      activityCode: f.activity.code,
      activityTitle: f.activity.title,
      company: f.activity.collegeName || f.user.collegeName || 'Corporate Partner',
      name: f.user.fullName,
      email: f.user.email,
      rating: f.rating,
      experience: f.experience,
      comments: f.experience,
      suggestion: f.suggestion,
      suggestions: f.suggestion,
      theme: f.rating === 5 ? 'Beneficiary Interaction' : f.rating === 4 ? 'Logistics & Venue' : 'Schedule & Timing',
      createdAt: f.createdAt,
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};
