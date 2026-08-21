import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

export const getDashboardAnalytics = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [totalEvents, totalLeads, leadsByStatus, distinctColleges] =
      await Promise.all([
        prisma.event.count(),
        prisma.studentLead.count(),
        prisma.studentLead.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
        prisma.studentLead.findMany({
          distinct: ['college'],
          select: { college: true },
        }),
      ]);

    const counts: Record<string, number> = {
      REGISTERED: 0,
      STARTED: 0,
      COMPLETED: 0,
      ACCEPTED: 0,
      REJECTED: 0,
    };

    leadsByStatus.forEach((item) => {
      counts[item.status] = item._count.status;
    });

    const activeInFunnel = totalLeads;
    const completedOrBeyond = counts.COMPLETED + counts.ACCEPTED;
    const startedOrBeyond = counts.STARTED + completedOrBeyond;

    const startedPercentage =
      activeInFunnel > 0
        ? Math.round((startedOrBeyond / activeInFunnel) * 100)
        : 0;
    const completionPercentage =
      activeInFunnel > 0
        ? Math.round((completedOrBeyond / activeInFunnel) * 100)
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalEvents,
        totalLeads,
        uniqueCollegesCount: distinctColleges.length,
        funnel: {
          registered: counts.REGISTERED,
          started: counts.STARTED,
          completed: completedOrBeyond, // Includes both COMPLETED and ACCEPTED
          completedOnly: counts.COMPLETED,
          accepted: counts.ACCEPTED,
          rejected: counts.REJECTED,
          startedPercentage,
          completionPercentage,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
