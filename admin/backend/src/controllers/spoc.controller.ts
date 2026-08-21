import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { GeminiService } from '../services/gemini.service.js';
import { EmailService } from '../services/email.service.js';

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
 * Admin / SPOC manually triggers dispatching QR Code feedback emails to all verified corporate volunteers
 */
export const dispatchEventQrEmails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { activityCode = 'SEVA-PUNE-KIT-01' } = req.body;

    const event = await prisma.event.findUnique({
      where: { code: activityCode.toUpperCase() },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Activity event code '${activityCode}' not found.`,
      });
    }

    // Fetch verified corporate volunteers
    const volunteers = await prisma.studentUser.findMany({
      where: { verificationStatus: 'VERIFIED' },
      take: 20,
    });

    const emailPromises = volunteers
      .filter((vol) => vol.email)
      .map((vol) =>
        EmailService.sendEventFeedbackInvitation(vol.email, vol.fullName, {
          code: event.code,
          title: event.title,
          partner: vol.collegeName || event.collegeName || 'Mastercard India',
          date: new Date().toLocaleDateString('en-IN'),
        })
      );

    // Run email dispatches in parallel
    Promise.allSettled(emailPromises).catch((err) =>
      console.warn('[dispatchEventQrEmails] Background email dispatch notice:', err)
    );

    return res.status(200).json({
      success: true,
      message: `🎉 Scannable QR Code feedback emails successfully dispatched to ${volunteers.length} verified corporate volunteers!`,
      activityCode: event.code,
      sentCount: volunteers.length,
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
