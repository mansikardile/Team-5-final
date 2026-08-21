import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { GeminiService } from '../services/gemini.service.js';

/**
 * Get pending volunteers for SPOC or Admin verification
 */
export const getPendingVolunteers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const where: any = {
      verificationStatus: 'PENDING_SPOC_VERIFICATION',
    };

    // If SPOC, filter volunteers belonging to their corporate company
    if (user?.role === 'SPOC' && user?.company) {
      where.collegeName = user.company;
    }

    const pendingList = await prisma.studentUser.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        collegeName: true,
        verificationStatus: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: pendingList.length,
      data: pendingList,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * SPOC verifies a volunteer registration
 */
export const verifyVolunteer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { volunteerId, action = 'VERIFY' } = req.body;
    const spocId = req.user?.id;

    const volunteer = await prisma.studentUser.findUnique({
      where: { id: volunteerId },
    });

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found',
      });
    }

    const newStatus = action === 'REJECT' ? 'REJECTED' : 'VERIFIED';

    const updated = await prisma.studentUser.update({
      where: { id: volunteerId },
      data: {
        verificationStatus: newStatus,
        verifiedById: spocId || null,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Volunteer ${updated.fullName} (${updated.email}) has been ${newStatus.toLowerCase()} successfully by Corporate SPOC.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get per-event Gemini AI executive summary
 */
export const getEventAiSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.params;

    const event = await prisma.event.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        volunteerFeedbacks: {
          include: {
            user: { select: { fullName: true, email: true, collegeName: true } },
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const feedbackList = event.volunteerFeedbacks.map((f) => ({
      name: f.user.fullName,
      company: f.user.collegeName || event.collegeName,
      rating: f.rating,
      experience: f.translatedExperience || f.experience,
      suggestion: f.translatedSuggestion || f.suggestion || undefined,
    }));

    const aiSummary = await GeminiService.generateEventExecutiveSummary(
      event.title,
      feedbackList
    );

    return res.status(200).json({
      success: true,
      eventCode: event.code,
      eventTitle: event.title,
      feedbacksAnalyzed: feedbackList.length,
      aiSummary,
    });
  } catch (error) {
    next(error);
  }
};
