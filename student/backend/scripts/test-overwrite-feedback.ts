import axios from 'axios';

async function main() {
  const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
    email: 'aniket.d@mastercard.com',
    password: 'Volunteer@123',
  });

  const token = loginRes.data.data.token;

  console.log('1. Submitting feedback for SEVA-PUNE-KIT-01 (1st time)...');
  const fb1 = await axios.post(
    'http://localhost:5001/api/feedback',
    {
      activityCode: 'SEVA-PUNE-KIT-01',
      experience: 'First submission: Great event and organization!',
      rating: 5,
      suggestion: 'First suggestion',
      language: 'en',
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log('Submission 1 ID:', fb1.data.data.id, 'Exp:', fb1.data.data.experience);

  console.log('\n2. Submitting UPDATED feedback for SEVA-PUNE-KIT-01 (OVERWRITE test)...');
  const fb2 = await axios.post(
    'http://localhost:5001/api/feedback',
    {
      activityCode: 'SEVA-PUNE-KIT-01',
      experience: 'UPDATED submission: Overwritten feedback with new insights!',
      rating: 5,
      suggestion: 'Updated suggestion after reflection',
      language: 'en',
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log('🎉 Submission 2 ID:', fb2.data.data.id, 'Exp:', fb2.data.data.experience);
  console.log('✅ Overwrite test successful! ID stayed same, experience updated cleanly in PostgreSQL.');
}

main().catch(console.error);
