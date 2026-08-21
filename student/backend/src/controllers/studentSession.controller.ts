import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { LeadStatus } from '@prisma/client';

export const getAvailableSessions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = req.student?.id;

    const events = await prisma.event.findMany({
      where: { isActive: true },
      orderBy: { eventDate: 'asc' },
      include: {
        _count: { select: { sessionRegistrations: true, leads: true } },
      },
    });

    let studentRegisteredEventIds = new Set<string>();

    if (studentId) {
      const myRegs = await prisma.sessionRegistration.findMany({
        where: { studentId },
        select: { eventId: true },
      });
      studentRegisteredEventIds = new Set(myRegs.map((r) => r.eventId));
    }

    const formatted = events.map((ev) => ({
      id: ev.id,
      code: ev.code,
      title: ev.title,
      collegeName: ev.collegeName,
      location: ev.location,
      eventDate: ev.eventDate,
      description: ev.description,
      totalAttendees: Math.max(ev._count.sessionRegistrations, ev._count.leads),
      isRegisteredByMe: studentRegisteredEventIds.has(ev.id),
    }));

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRegistrations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.student) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const registrations = await prisma.sessionRegistration.findMany({
      where: { studentId: req.student.id },
      include: {
        event: true,
      },
      orderBy: { registeredAt: 'desc' },
    });

    const studentLead = await prisma.studentLead.findFirst({
      where: { email: req.student.email.toLowerCase().trim() },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = registrations.map((r) => ({
      ...r,
      leadStatus: studentLead?.status || 'REGISTERED',
      trackingId: studentLead?.trackingId || r.id,
    }));

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const registerForSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let studentId = req.student?.id;
    const { id: eventId } = req.params;
    const {
      fullName,
      email,
      phone,
      collegeName,
      yearOfStudy,
      branch,
      digitalConsent = true,
      signatureDataUrl,
      syncedFromOffline = false,
    } = req.body;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Session event not found',
      });
    }

    // If user is not logged in, allow frictionless guest registration
    if (!studentId) {
      if (!fullName || !email) {
        return res.status(400).json({
          success: false,
          message: 'Full name and email address are required to register.',
        });
      }

      // Find or create student user record
      let student = await prisma.studentUser.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!student) {
        student = await prisma.studentUser.create({
          data: {
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            phone: phone?.trim() || null,
            collegeName: collegeName?.trim() || event.collegeName,
            yearOfStudy: yearOfStudy?.trim() || 'Undergraduate STEM',
            branch: branch?.trim() || 'Engineering',
            isProfileComplete: false,
          },
        });
      }

      studentId = student.id;
    }

    // Check if already registered
    const existing = await prisma.sessionRegistration.findUnique({
      where: {
        studentId_eventId: {
          studentId,
          eventId,
        },
      },
      include: { event: true },
    });

    if (existing) {
      const existingLead = await prisma.studentLead.findFirst({
        where: {
          email: student?.email || email.toLowerCase().trim(),
          eventId,
        },
      });

      const leadTrackingId = existingLead?.trackingId || existing.id;
      return res.status(200).json({
        success: true,
        message: 'You are already registered for this session!',
        data: {
          ...existing,
          trackingId: leadTrackingId,
          personalizedUrl: `http://localhost:3001/apply/${leadTrackingId}`,
        },
      });
    }

    // Fetch student info
    const student = await prisma.studentUser.findUnique({
      where: { id: studentId },
    });

    const registration = await prisma.sessionRegistration.create({
      data: {
        studentId,
        eventId,
      },
      include: {
        event: true,
      },
    });

    let leadTrackingId = `kat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let personalizedUrl = `http://localhost:3001/apply/${leadTrackingId}`;

    // Also sync with student_leads table with digital consent and signature
    if (student) {
      try {
        const lead = await prisma.studentLead.create({
          data: {
            trackingId: leadTrackingId,
            fullName: student.fullName,
            email: student.email,
            phone: student.phone || phone || 'N/A',
            college: student.collegeName || collegeName || event.collegeName,
            yearOfStudy: student.yearOfStudy || yearOfStudy || 'Undergraduate STEM',
            fieldOfStudy: student.branch || branch || 'Engineering',
            eventId: event.id,
            status: LeadStatus.REGISTERED,
            digitalConsent: Boolean(digitalConsent),
            signatureDataUrl: signatureDataUrl || null,
            syncedFromOffline: Boolean(syncedFromOffline),
            personalizedUrl,
          },
        });
        leadTrackingId = lead.trackingId;
        personalizedUrl = `http://localhost:3001/apply/${lead.trackingId}`;
      } catch (leadError) {
        console.log('Lead record synced or already present:', leadError);
      }
    }

    return res.status(201).json({
      success: true,
      message: `🎉 Successfully registered for "${event.title}"! Your digital entry pass is ready.`,
      data: {
        ...registration,
        trackingId: leadTrackingId,
        personalizedUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadByTrackingId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { trackingId } = req.params;

    const lead = await prisma.studentLead.findUnique({
      where: { trackingId },
      include: {
        event: {
          select: { code: true, title: true, collegeName: true, eventDate: true },
        },
      },
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Personalized application link not found or expired',
      });
    }

    // Advance conversion funnel: Registered -> Started
    if (lead.status === LeadStatus.REGISTERED) {
      await prisma.studentLead.update({
        where: { trackingId },
        data: { status: LeadStatus.STARTED },
      });
      lead.status = LeadStatus.STARTED;
    }

    return res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.student) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id: eventId } = req.params;

    await prisma.sessionRegistration.delete({
      where: {
        studentId_eventId: {
          studentId: req.student.id,
          eventId,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Registration successfully cancelled',
    });
  } catch (error) {
    next(error);
  }
};
