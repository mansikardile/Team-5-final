import { EmailService } from '../src/services/email.service.js';

async function main() {
  const targetEmail = 'mansikardile05@gmail.com';

  console.log('Sending real email with inline scannable QR Code to:', targetEmail);

  const res = await EmailService.sendEventFeedbackInvitation(
    targetEmail,
    'Mansi Kardile',
    {
      code: 'SEVA-PUNE-KIT-01',
      title: 'Samutkarsh: 500 School Kits Assembly & Distribution',
      partner: 'Mastercard India',
      location: 'Kothrud, Pune',
      date: 'Today • 2:00 PM',
    }
  );

  console.log('🎉 RESULT:', res);
}

main().catch(console.error);
