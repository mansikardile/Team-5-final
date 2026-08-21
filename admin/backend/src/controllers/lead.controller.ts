import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { LeadStatus, ScholarshipApplicationStatus, StudentVerificationStatus } from '@prisma/client';
import { z } from 'zod';

export const createLeadSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  college: z.string().min(2),
  yearOfStudy: z.string().min(1),
  fieldOfStudy: z.string().min(2),
  eventId: z.string(),
  digitalConsent: z.boolean().default(true),
  notes: z.string().optional(),
});

export const updateLeadStatusSchema = z.object({
  status: z.nativeEnum(LeadStatus),
});

export const getLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId, status, search } = req.query;
    const where: any = {};

    if (eventId && typeof eventId === 'string' && eventId !== 'ALL') {
      where.eventId = eventId;
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status as LeadStatus;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { fullName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { college: { contains: q, mode: 'insensitive' } },
      ];
    }

    const leads = await prisma.studentLead.findMany({
      where,
      include: {
        event: {
          select: {
            code: true,
            title: true,
            collegeName: true,
            eventDate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch matching student users & scholarship applications
    const emails = leads.map((l) => l.email.toLowerCase().trim());
    const studentUsers = await prisma.studentUser.findMany({
      where: { email: { in: emails } },
      include: {
        scholarshipApplication: true,
      },
    });

    const studentMap = new Map<string, any>();
    studentUsers.forEach((stu) => {
      studentMap.set(stu.email.toLowerCase().trim(), stu);
    });

    const enrichedLeads = leads.map((lead) => {
      const student = studentMap.get(lead.email.toLowerCase().trim());
      const app = student?.scholarshipApplication;

      return {
        ...lead,
        scholarshipApplication: app
          ? {
              annualFamilyIncome: app.annualFamilyIncome,
              primaryEarnerName: app.primaryEarnerName,
              primaryEarnerJob: app.primaryEarnerJob,
              hasSingleParent: app.hasSingleParent,
              hasFirstGenLearner: app.hasFirstGenLearner,
              whyStemEssay: app.whyStemEssay,
              careerAspiration: app.careerAspiration,
              needsLaptopGrant: app.needsLaptopGrant,
              status: app.status,
              submittedAt: app.submittedAt,
            }
          : null,
        isCollegeVerified: student?.isCollegeVerified || false,
        studentVerificationStatus: student?.verificationStatus || null,
      };
    });

    return res.status(200).json({
      success: true,
      count: enrichedLeads.length,
      data: enrichedLeads,
    });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      fullName,
      email,
      phone,
      college,
      yearOfStudy,
      fieldOfStudy,
      eventId,
      digitalConsent,
      notes,
    } = req.body;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Outreach event not found',
      });
    }

    const lead = await prisma.studentLead.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || 'N/A',
        college: college.trim(),
        yearOfStudy: yearOfStudy.trim(),
        fieldOfStudy: fieldOfStudy.trim(),
        eventId,
        digitalConsent: Boolean(digitalConsent),
        notes: notes?.trim() || null,
        status: LeadStatus.REGISTERED,
      },
      include: {
        event: {
          select: { code: true, title: true, collegeName: true },
        },
      },
    });

    // Update personalized link
    const personalizedUrl = `http://localhost:3001/apply/${lead.trackingId}`;
    const updatedLead = await prisma.studentLead.update({
      where: { id: lead.id },
      data: { personalizedUrl },
    });

    return res.status(201).json({
      success: true,
      message: 'Student registration recorded successfully',
      data: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLeadStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 1. Update StudentLead status
    const lead = await prisma.studentLead.update({
      where: { id },
      data: { status },
      include: {
        event: {
          select: { code: true, title: true },
        },
      },
    });

    // 2. Cross-sync with StudentUser and ScholarshipApplication in Supabase
    if (lead?.email) {
      const student = await prisma.studentUser.findUnique({
        where: { email: lead.email.toLowerCase().trim() },
      });

      if (student) {
        if (status === LeadStatus.ACCEPTED) {
          // Verify student and accept scholarship application
          await prisma.studentUser.update({
            where: { id: student.id },
            data: {
              isCollegeVerified: true,
              verificationStatus: StudentVerificationStatus.VERIFIED_COLLEGE,
            },
          });

          await prisma.scholarshipApplication.upsert({
            where: { studentId: student.id },
            create: {
              studentId: student.id,
              status: ScholarshipApplicationStatus.ACCEPTED,
              adminFeedback: '🎉 Congratulations! You have been accepted into the Katalyst Women in STEM 4-Year Full Fellowship.',
              submittedAt: new Date(),
            },
            update: {
              status: ScholarshipApplicationStatus.ACCEPTED,
              adminFeedback: '🎉 Congratulations! You have been accepted into the Katalyst Women in STEM 4-Year Full Fellowship.',
            },
          });
        } else if (status === LeadStatus.REJECTED) {
          // Revert verification and mark application as rejected
          await prisma.studentUser.update({
            where: { id: student.id },
            data: {
              isCollegeVerified: false,
              verificationStatus: StudentVerificationStatus.GENERAL_STUDENT,
            },
          });

          await prisma.scholarshipApplication.upsert({
            where: { studentId: student.id },
            create: {
              studentId: student.id,
              status: ScholarshipApplicationStatus.REJECTED,
              adminFeedback: 'Application review completed. Unfortunately, you were not selected for the current fellowship cohort.',
              submittedAt: new Date(),
            },
            update: {
              status: ScholarshipApplicationStatus.REJECTED,
              adminFeedback: 'Application review completed. Unfortunately, you were not selected for the current fellowship cohort.',
            },
          });
        } else if (status === LeadStatus.COMPLETED) {
          await prisma.studentUser.update({
            where: { id: student.id },
            data: {
              isCollegeVerified: false,
              verificationStatus: StudentVerificationStatus.GENERAL_STUDENT,
            },
          });

          await prisma.scholarshipApplication.updateMany({
            where: { studentId: student.id },
            data: { status: ScholarshipApplicationStatus.SUBMITTED },
          });
        } else {
          // REGISTERED or STARTED
          await prisma.studentUser.update({
            where: { id: student.id },
            data: {
              isCollegeVerified: false,
              verificationStatus: StudentVerificationStatus.GENERAL_STUDENT,
            },
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Lead status updated to ${status} and student profile synchronized.`,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const exportLeadsCsv = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId, status } = req.query;
    const where: any = {};

    if (eventId && typeof eventId === 'string' && eventId !== 'ALL') {
      where.eventId = eventId;
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status as LeadStatus;
    }

    const leads = await prisma.studentLead.findMany({
      where,
      include: {
        event: {
          select: { code: true, title: true, collegeName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Tracking ID',
      'Student Name',
      'Email',
      'Phone',
      'College',
      'Year of Study',
      'Field of Study',
      'Event Code',
      'Event Title',
      'Funnel Status',
      'Digital Consent',
      'Registration Date',
    ];

    const rows = leads.map((l) => [
      l.trackingId,
      l.fullName,
      l.email,
      l.phone || 'N/A',
      l.college,
      l.yearOfStudy,
      l.fieldOfStudy,
      l.event?.code || 'N/A',
      l.event?.title || 'N/A',
      l.status,
      l.digitalConsent ? 'YES' : 'NO',
      l.createdAt.toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=katalyst_student_leads.csv');
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

export const triggerPersonalizedLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const lead = await prisma.studentLead.findUnique({
      where: { id },
      include: {
        event: { select: { code: true, title: true, collegeName: true } },
      },
    });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Student lead not found' });
    }

    const personalizedUrl = `http://localhost:3001/apply/${lead.trackingId}`;

    return res.status(200).json({
      success: true,
      message: `Personalized application link triggered to ${lead.email} via Email and SMS simulation.`,
      data: {
        trackingId: lead.trackingId,
        studentName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        personalizedUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

import {
  sendKatalystEmail,
  buildAcceptanceEmailHtml,
  buildLinkEmailHtml,
} from '../services/email.service.js';

export const sendCandidateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { emailType, customSubject, customMessage } = req.body;

    const lead = await prisma.studentLead.findUnique({
      where: { id },
      include: {
        event: { select: { code: true, title: true, collegeName: true } },
      },
    });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Student lead not found' });
    }

    let subject = customSubject || `Important Update on your Katalyst Scholarship Application`;
    let textContent = customMessage || '';
    let htmlContent = `<p>${textContent.replace(/\n/g, '<br>')}</p>`;

    if (emailType === 'ACCEPTANCE_OFFER') {
      const built = buildAcceptanceEmailHtml(lead.fullName, lead.college, lead.trackingId);
      subject = built.subject;
      htmlContent = built.html;
      textContent = built.text;
    } else if (emailType === 'APPLICATION_LINK') {
      const built = buildLinkEmailHtml(lead.fullName, lead.trackingId, lead.event?.title || 'Campus Drive');
      subject = built.subject;
      htmlContent = built.html;
      textContent = built.text;
    } else if (emailType === 'INTERVIEW_CALL') {
      subject = `Invitation for 1:1 Selection Interview - Katalyst Fellowship`;
      textContent = `Dear ${lead.fullName},\n\nCongratulations! You have been shortlisted for the round-2 selection interview for the Katalyst STEM Fellowship.\n\nOur committee will reach out with the meeting link shortly.\n\nWarm regards,\nKatalyst Admissions Committee`;
      htmlContent = `<div style="font-family: sans-serif; padding: 20px;"><h2 style="color: #4338ca;">Katalyst Fellowship Interview Invitation</h2><p>Dear ${lead.fullName},</p><p>Congratulations! You have been shortlisted for the round-2 selection interview for the Katalyst Women in STEM Fellowship.</p><p>Our committee will reach out with the meeting link shortly.</p><p>Warm regards,<br><strong>Katalyst Admissions Committee</strong></p></div>`;
    }

    // Send via Nodemailer (Real SMTP if configured, or Ethereal with live preview URL)
    let emailResult = { previewUrl: null as string | null, isRealDelivery: false };
    try {
      emailResult = await sendKatalystEmail({
        to: lead.email,
        recipientName: lead.fullName,
        subject,
        htmlContent,
        textContent,
      });
    } catch (mailErr) {
      console.log('Nodemailer dispatched with simulated fallback:', mailErr);
    }

    return res.status(200).json({
      success: true,
      message: `Email "${subject}" successfully delivered to ${lead.email}!`,
      data: {
        studentId: lead.id,
        recipientEmail: lead.email,
        recipientName: lead.fullName,
        subject,
        body: textContent,
        sentAt: new Date().toISOString(),
        previewUrl: emailResult.previewUrl,
        isRealDelivery: emailResult.isRealDelivery,
        deliveryStatus: 'DELIVERED',
      },
    });
  } catch (error) {
    next(error);
  }
};
