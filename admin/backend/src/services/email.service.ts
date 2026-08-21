import nodemailer from 'nodemailer';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER || 'mansikardile05@gmail.com',
      pass: process.env.SMTP_PASS || 'mvfx zbpd tdow hpgm',
    },
  });

  /**
   * Dispatches automated invitation & feedback notification emails with inline QR code to corporate volunteers
   */
  public static async sendEventFeedbackInvitation(
    recipientEmail: string,
    volunteerName: string,
    eventDetails: {
      code: string;
      title: string;
      partner: string;
      location?: string;
      date: string;
    }
  ) {
    // Use machine Wi-Fi IP or Vercel URL so phone cameras can open it instantly when scanning
    const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://192.168.28.60:3001';
    const feedbackUrl = `${baseUrl}/feedback?activityCode=${eventDetails.code}`;
    const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(feedbackUrl)}`;

    const mailOptions = {
      from: '"SevaSahayog Foundation" <mansikardile05@gmail.com>',
      to: recipientEmail,
      subject: `🌟 [${eventDetails.partner}] QR Scan & Submit Volunteering Feedback: ${eventDetails.title}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0f2b5c 0%, #1e40af 100%); padding: 32px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">SevaSahayog Foundation</h1>
            <p style="margin: 8px 0 0; font-size: 13px; color: #93c5fd;">Corporate Volunteer Experience Platform</p>
          </div>
          
          <div style="padding: 32px; background-color: #ffffff;">
            <p style="font-size: 15px; color: #1e293b; margin-top: 0;">Dear <strong>${volunteerName}</strong>,</p>
            
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              Thank you for contributing your valuable time to our corporate volunteering drive with <strong>${eventDetails.partner}</strong>!
            </p>
            
            <div style="background-color: #f1f5f9; border-left: 4px solid #0f2b5c; padding: 16px; border-radius: 12px; margin: 20px 0;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Activity Details:</p>
              <h3 style="margin: 0 0 6px; font-size: 16px; color: #0f172a;">${eventDetails.title}</h3>
              <p style="margin: 0; font-size: 12px; font-family: monospace; color: #1d4ed8; font-weight: bold;">
                Activity Code: ${eventDetails.code}
              </p>
            </div>

            <!-- INLINE SCANNABLE QR CODE IMAGE FOR MOBILE PHONE CAMERAS -->
            <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 20px; padding: 24px; text-align: center; margin: 24px 0;">
              <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 800; color: #0f2b5c;">
                📱 Scan QR Code with Phone Camera to Open Form:
              </p>
              <img src="${qrCodeImageUrl}" alt="Scan QR Code" style="width: 190px; height: 190px; border: 4px solid #0f2b5c; border-radius: 16px; padding: 8px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);" />
              <p style="margin: 12px 0 0 0; font-size: 11px; color: #64748b;">
                Scan with any smartphone camera or QR reader to open feedback form
              </p>
            </div>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${feedbackUrl}" style="background-color: #0f2b5c; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 10px 25px -5px rgba(15,43,92,0.3);">
                ⚡ Direct Feedback Submission Link
              </a>
            </div>
            
            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">
              Note: You will be asked to log in via 6-Digit Email OTP to verify your volunteer feedback submission.
            </p>
          </div>
          
          <div style="padding: 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b;">
            SevaSahayog Foundation • Pune Head Office: 18, Navketan Society, Kothrud, Pune 411038<br/>
            Registered 80G &amp; FCRA Certified NGO
          </div>
        </div>
      `,
    };

    console.log(`[EmailService] 📧 Sending Phone-Scannable QR Code Email (${feedbackUrl}) to: ${recipientEmail}`);
    
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`[EmailService] ✅ Email with QR Code sent successfully to ${recipientEmail}`);
    } catch (err: any) {
      console.warn(`[EmailService] SMTP Notice: ${err?.message || 'Logged to console'}`);
    }

    return {
      success: true,
      recipient: recipientEmail,
      feedbackUrl,
      qrCodeImageUrl,
    };
  }
}
