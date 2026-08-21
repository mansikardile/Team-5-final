import axios from 'axios';

async function main() {
  const adminLoginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'admin@sevasahayog.org',
    password: 'SevaAdmin2026!',
  });

  const adminToken = adminLoginRes.data.data.token;
  const targetEventCode = 'SEVA-MUM-DIGI-02';

  console.log(`1. Testing QR Code Email Dispatch API for event: ${targetEventCode}...`);

  const dispatchRes = await axios.post(
    'http://localhost:5000/api/spoc/dispatch-qr-emails',
    { activityCode: targetEventCode },
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );

  console.log('🎉 DISPATCH RESPONSE:', dispatchRes.data);

  console.log('\n2. Verifying QR Code URL structure...');
  const expectedFeedbackUrl = `http://192.168.28.60:3001/feedback?activityCode=${targetEventCode}`;
  const expectedQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(expectedFeedbackUrl)}`;

  console.log('• Phone Scannable Feedback URL:', expectedFeedbackUrl);
  console.log('• QR Code Image URL:', expectedQrImageUrl);

  // Test submitting feedback for this event via API
  console.log('\n3. Simulating Volunteer scanning QR code and submitting feedback for SEVA-MUM-DIGI-02...');
  const studentLoginRes = await axios.post('http://localhost:5001/api/auth/login', {
    email: 'pooja.sharma@mastercard.com',
    password: 'Volunteer@123',
  });

  const studentToken = studentLoginRes.data.data.token;

  const fbRes = await axios.post(
    'http://localhost:5001/api/feedback',
    {
      activityCode: targetEventCode,
      experience: 'Scanned QR code at Barclays coding workshop station! Excellent Scratch programming session.',
      rating: 5,
      suggestion: 'Provide headsets for the audio coding modules.',
      language: 'en',
    },
    { headers: { Authorization: `Bearer ${studentToken}` } }
  );

  console.log('🎉 FEEDBACK SUBMISSION AFTER QR SCAN SUCCESSFUL:');
  console.log({
    feedbackId: fbRes.data.data.id,
    activityCode: fbRes.data.data.activityCode,
    volunteer: fbRes.data.data.volunteerName,
    experience: fbRes.data.data.experience,
  });
}

main().catch(console.error);
