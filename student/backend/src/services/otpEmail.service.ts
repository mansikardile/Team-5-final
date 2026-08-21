import nodemailer from 'nodemailer';

export class OtpEmailService {
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
   * Send real 6-digit OTP verification email to volunteer
   */
  public static async sendOtpEmail(toEmail: string, fullName: string, otpCode: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: '"SevaSahayog Volunteer Portal" <mansikardile05@gmail.com>',
        to: toEmail,
        subject: `🔑 Your SevaSahayog Volunteer OTP Code: ${otpCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
            <div style="background-color: #0f2b5c; padding: 20px; border-radius: 12px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 20px;">SevaSahayog Foundation</h2>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #7dd3fc;">Volunteer Experience & Feedback Portal</p>
            </div>

            <div style="padding: 24px 8px;">
              <p style="font-size: 14px; color: #1e293b;">Namaste <strong>${fullName}</strong>,</p>
              <p style="font-size: 14px; color: #475569; line-height: 1.5;">
                You requested a single-use OTP code to log in and submit your corporate volunteering feedback.
              </p>

              <div style="background-color: #f8fafc; border: 2px dashed #0f2b5c; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0;">
                <span style="display: block; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Your 6-Digit OTP Code</span>
                <span style="font-size: 36px; font-weight: 900; font-family: monospace; color: #0f2b5c; letter-spacing: 6px; display: block; margin-top: 8px;">${otpCode}</span>
                <span style="display: block; font-size: 11px; color: #94a3b8; margin-top: 8px;">Valid for 15 minutes • Do not share this code with anyone</span>
              </div>

              <p style="font-size: 12px; color: #64748b; line-height: 1.4;">
                If you did not request this OTP, please ignore this email.
              </p>
            </div>

            <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center; font-size: 11px; color: #94a3b8;">
              SevaSahayog Foundation • Corporate CSR Volunteering Drive System
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`[OtpEmailService] Real OTP email dispatched successfully to ${toEmail}`);
      return true;
    } catch (err: any) {
      console.error('[OtpEmailService] Error sending real OTP email:', err?.message || err);
      return false;
    }
  }
}
