import { EmailService } from '../src/services/email.service.js';

async function main() {
  const recipient = 'mansikardile05@gmail.com';

  console.log(`📧 Sending real email with inline scannable QR Code to: ${recipient}...`);

  const res = await EmailService.sendEventFeedbackInvitation(
    recipient,
    'Mansi Kardile',
    {
      code: 'SEVA-PUNE-KIT-01',
      title: 'Samutkarsh: 500 School Science Kits Assembly & Distribution',
      partner: 'Mastercard India',
      location: 'Kothrud, Pune',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    }
  );

  console.log('🎉 EMAIL DISPATCH RESULT:');
  console.log(res);
}

main().catch(console.error);
