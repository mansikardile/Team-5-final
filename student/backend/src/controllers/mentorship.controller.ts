import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { MentorshipStatus } from '@prisma/client';

export const getMentors = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mentors = await prisma.mentor.findMany({
      orderBy: { experienceYrs: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: mentors,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyMentorshipRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.student) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const requests = await prisma.mentorshipRequest.findMany({
      where: { studentId: req.student.id },
      include: { mentor: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const createMentorshipRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.student) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { mentorId, goalsNotes, preferredDomain } = req.body;

    if (!mentorId) {
      return res.status(400).json({
        success: false,
        message: 'Mentor selection is required',
      });
    }

    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Selected mentor not found',
      });
    }

    const mentorshipRequest = await prisma.mentorshipRequest.create({
      data: {
        studentId: req.student.id,
        mentorId,
        goalsNotes: goalsNotes?.trim(),
        preferredDomain: preferredDomain?.trim() || mentor.expertise,
        status: MentorshipStatus.MATCHED,
        meetingLink: 'https://meet.google.com/katalyst-scholar-mentorship',
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      },
      include: {
        mentor: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: `🎉 Successfully matched with ${mentor.name} (${mentor.company})! Your 1:1 onboarding session is scheduled.`,
      data: mentorshipRequest,
    });
  } catch (error) {
    next(error);
  }
};
