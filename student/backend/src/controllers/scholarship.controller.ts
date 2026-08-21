import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ScholarshipApplicationStatus, LeadStatus } from '@prisma/client';

export const getMyApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.student) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const application = await prisma.scholarshipApplication.findUnique({
      where: { studentId: req.student.id },
    });

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const saveOrSubmitApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.student) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const studentId = req.student.id;
    const {
      isSubmit,
      currentCgpaOrMarks,
      tenthPercentage,
      twelfthPercentage,
      diplomaPercentage,
      admissionCategory,
      annualFamilyIncome,
      primaryEarnerName,
      primaryEarnerJob,
      familyMembersCount,
      hasSingleParent,
      hasFirstGenLearner,
      incomeCertUrl,
      collegeIdCardUrl,
      marksheetUrl,
      rationCardUrl,
      whyStemEssay,
      careerAspiration,
      needsLaptopGrant,
    } = req.body;

    const status = isSubmit
      ? ScholarshipApplicationStatus.SUBMITTED
      : ScholarshipApplicationStatus.DRAFT;

    const dataToSave = {
      currentCgpaOrMarks,
      tenthPercentage,
      twelfthPercentage,
      diplomaPercentage,
      admissionCategory,
      annualFamilyIncome,
      primaryEarnerName,
      primaryEarnerJob,
      familyMembersCount: familyMembersCount ? parseInt(familyMembersCount) : undefined,
      hasSingleParent: Boolean(hasSingleParent),
      hasFirstGenLearner: Boolean(hasFirstGenLearner),
      incomeCertUrl,
      collegeIdCardUrl,
      marksheetUrl,
      rationCardUrl,
      whyStemEssay,
      careerAspiration,
      needsLaptopGrant: needsLaptopGrant !== undefined ? Boolean(needsLaptopGrant) : true,
      status,
      submittedAt: isSubmit ? new Date() : undefined,
    };

    const application = await prisma.scholarshipApplication.upsert({
      where: { studentId },
      create: {
        studentId,
        ...dataToSave,
      },
      update: dataToSave,
    });

    // If re-submitted, sync lead status to COMPLETED so Admin sees it in active review queue
    if (isSubmit && req.student?.email) {
      try {
        await prisma.studentLead.updateMany({
          where: { email: req.student.email.toLowerCase().trim() },
          data: { status: LeadStatus.COMPLETED },
        });
      } catch (e) {}
    }

    return res.status(200).json({
      success: true,
      message: isSubmit
        ? '🎉 Scholarship Application submitted successfully! Our committee will review your application.'
        : 'Application draft saved.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const submitOfflineOrPersonalizedApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      trackingId,
      fullName,
      email,
      phone,
      collegeName,
      yearOfStudy,
      branch,
      annualFamilyIncome,
      primaryEarnerName,
      primaryEarnerJob,
      hasSingleParent,
      hasFirstGenLearner,
      whyStemEssay,
      careerAspiration,
      needsLaptopGrant,
      signatureDataUrl,
      digitalConsent = true,
    } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Find or create student user
    let student = await prisma.studentUser.findUnique({
      where: { email: cleanEmail },
    });

    if (!student) {
      student = await prisma.studentUser.create({
        data: {
          fullName: fullName?.trim() || 'Scholar Applicant',
          email: cleanEmail,
          phone: phone?.trim() || null,
          collegeName: collegeName?.trim() || 'Engineering College',
          yearOfStudy: yearOfStudy?.trim() || '1st Year Engineering',
          branch: branch?.trim() || 'Engineering',
          isProfileComplete: true,
        },
      });
    } else {
      await prisma.studentUser.update({
        where: { id: student.id },
        data: {
          fullName: fullName?.trim() || student.fullName,
          phone: phone?.trim() || student.phone,
          collegeName: collegeName?.trim() || student.collegeName,
          yearOfStudy: yearOfStudy?.trim() || student.yearOfStudy,
          branch: branch?.trim() || student.branch,
          isProfileComplete: true,
        },
      });
    }

    // 2. Create or update application with SUBMITTED status
    const dataToSave = {
      annualFamilyIncome,
      primaryEarnerName,
      primaryEarnerJob,
      hasSingleParent: Boolean(hasSingleParent),
      hasFirstGenLearner: Boolean(hasFirstGenLearner),
      whyStemEssay,
      careerAspiration,
      needsLaptopGrant: needsLaptopGrant !== undefined ? Boolean(needsLaptopGrant) : true,
      status: ScholarshipApplicationStatus.SUBMITTED,
      submittedAt: new Date(),
    };

    const application = await prisma.scholarshipApplication.upsert({
      where: { studentId: student.id },
      create: {
        studentId: student.id,
        ...dataToSave,
      },
      update: dataToSave,
    });

    // 3. Update all matching student leads in database to COMPLETED with latest details and signature
    try {
      await prisma.studentLead.updateMany({
        where: {
          OR: [
            { email: cleanEmail },
            { email: { equals: cleanEmail, mode: 'insensitive' } },
            ...(trackingId ? [{ trackingId }] : []),
          ],
        },
        data: {
          fullName: fullName?.trim() || student.fullName,
          phone: phone?.trim() || student.phone || 'N/A',
          college: collegeName?.trim() || student.collegeName || 'Engineering College',
          yearOfStudy: yearOfStudy?.trim() || student.yearOfStudy || '1st Year Engineering',
          fieldOfStudy: branch?.trim() || student.branch || 'Engineering',
          status: LeadStatus.COMPLETED,
          signatureDataUrl: signatureDataUrl || undefined,
          digitalConsent: Boolean(digitalConsent),
          notes: whyStemEssay ? `Why STEM: ${whyStemEssay.slice(0, 150)} | Career: ${careerAspiration?.slice(0, 100) || ''}` : undefined,
        },
      });
    } catch (leadErr) {
      console.log('Lead update err:', leadErr);
    }

    return res.status(200).json({
      success: true,
      message: '🎉 Application submitted successfully! Funnel marked as COMPLETED.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
