import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { GeminiService } from '../services/gemini.service.js';

export const submitFeedbackSchema = z.object({
  activityCode: z.string().min(3, 'Activity code is required'),
  experience: z.string().min(5, 'Please provide details on your experience (at least 5 characters)'),
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  suggestion: z.string().optional(),
  language: z.string().optional().default('en'),
});

/**
 * Submit 1-Minute Volunteer Feedback with Gemini Multilingual Translation
 */
export const submitFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.student?.id || (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to submit your volunteering feedback.',
      });
    }

    const { activityCode, experience, rating, suggestion, language = 'en' } = req.body;

    // 1. Find Activity / Event by Code
    const cleanCode = activityCode.trim().toUpperCase();
    const event = await prisma.event.findUnique({
      where: { code: cleanCode },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Activity with code '${cleanCode}' does not exist. Please check the code or QR.`,
      });
    }

    // 2. Gemini Multilingual Translation (Hindi/Marathi -> English)
    let translatedExp: string | null = null;
    let translatedSugg: string | null = null;

    if (language !== 'en') {
      const sourceLangName = language === 'hi' ? 'Hindi' : 'Marathi';
      translatedExp = await GeminiService.translateToEnglish(experience.trim(), sourceLangName);
      if (suggestion?.trim()) {
        translatedSugg = await GeminiService.translateToEnglish(suggestion.trim(), sourceLangName);
      }
    }

    // 3. Upsert verified feedback record in PostgreSQL (Overwrite if submitted again)
    const feedback = await prisma.volunteerFeedback.upsert({
      where: {
        userId_activityId: {
          userId,
          activityId: event.id,
        },
      },
      update: {
        language: language || 'en',
        experience: experience.trim(),
        translatedExperience: translatedExp || experience.trim(),
        rating: Number(rating),
        suggestion: suggestion?.trim() || null,
        translatedSuggestion: translatedSugg || suggestion?.trim() || null,
      },
      create: {
        userId,
        activityId: event.id,
        language: language || 'en',
        experience: experience.trim(),
        translatedExperience: translatedExp || experience.trim(),
        rating: Number(rating),
        suggestion: suggestion?.trim() || null,
        translatedSuggestion: translatedSugg || suggestion?.trim() || null,
      },
      include: {
        activity: {
          select: {
            code: true,
            title: true,
            collegeName: true,
          },
        },
        user: {
          select: {
            fullName: true,
            email: true,
            collegeName: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Volunteering feedback submitted and verified successfully in Seva Experience Ledger.',
      data: {
        id: feedback.id,
        activityCode: feedback.activity.code,
        activityTitle: feedback.activity.title,
        partner: feedback.activity.collegeName,
        volunteerName: feedback.user.fullName,
        volunteerEmail: feedback.user.email,
        language: feedback.language,
        rating: feedback.rating,
        experience: feedback.experience,
        translatedExperience: feedback.translatedExperience,
        suggestion: feedback.suggestion,
        translatedSuggestion: feedback.translatedSuggestion,
        createdAt: feedback.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get volunteer's own feedback history
 */
export const getMyFeedbacks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.student?.id || (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const feedbacks = await prisma.volunteerFeedback.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        activity: {
          select: {
            code: true,
            title: true,
            collegeName: true,
            eventDate: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all feedbacks (for admin or SPOC aggregation)
 */
export const getAllFeedbacks = async (
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
      language: f.language,
      rating: f.rating,
      experience: f.translatedExperience || f.experience,
      originalExperience: f.experience,
      comments: f.translatedExperience || f.experience,
      suggestion: f.translatedSuggestion || f.suggestion,
      suggestions: f.translatedSuggestion || f.suggestion,
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
