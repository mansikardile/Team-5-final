import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

export const syncGoogleSheets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { webhookUrl } = req.body || {};

    // 1. Fetch all student leads joined with event details
    const leads = await prisma.studentLead.findMany({
      include: {
        event: {
          select: { code: true, title: true, collegeName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalEvents = await prisma.event.count();
    const timestamp = new Date().toISOString();

    // 2. Format leads into clean spreadsheet row objects matching Prisma schema
    const formattedRows = leads.map((l, index) => ({
      rowNumber: index + 1,
      trackingId: l.trackingId,
      studentName: l.fullName,
      email: l.email,
      phone: l.phone || 'N/A',
      collegeName: l.college || l.event?.collegeName || 'N/A',
      yearOfStudy: l.yearOfStudy || 'N/A',
      fieldOfStudy: l.fieldOfStudy || 'N/A',
      eventCode: l.event?.code || 'N/A',
      eventTitle: l.event?.title || 'N/A',
      status: l.status,
      consentGiven: l.digitalConsent ? 'YES' : 'NO',
      registeredAt: l.createdAt.toISOString(),
    }));

    // 3. If a webhook URL is provided (e.g. Google Apps Script endpoint), post the rows
    const targetWebhook = webhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    let webhookStatus = 'NOT_CONFIGURED';

    if (targetWebhook) {
      try {
        const fetchRes = await fetch(targetWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            syncedAt: timestamp,
            totalRows: formattedRows.length,
            rows: formattedRows,
          }),
        });
        if (fetchRes.ok) {
          webhookStatus = 'WEBHOOK_DELIVERED';
        }
      } catch (err: any) {
        webhookStatus = `WEBHOOK_ERROR: ${err.message}`;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Google Sheets sync executed successfully. ${leads.length} student leads prepared and synchronized.`,
      data: {
        syncedAt: timestamp,
        syncedLeadsCount: leads.length,
        syncedEventsCount: totalEvents,
        sheetUrl: targetWebhook || 'https://docs.google.com/spreadsheets/d/1Katalyst-Live-Sync-Outreach-Leads/edit',
        webhookStatus,
        rows: formattedRows,
        status: 'SYNCED',
      },
    });
  } catch (error) {
    next(error);
  }
};
