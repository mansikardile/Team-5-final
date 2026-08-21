import axios from 'axios';

async function main() {
  // 1. Executive Admin Login
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'admin@sevasahayog.org',
    password: 'SevaAdmin2026!',
  });

  const token = loginRes.data.data.token;
  console.log('1. Executive Admin Authenticated Successfully!');

  const uniqueCode = `SEVA-ROBO-${Math.floor(1000 + Math.random() * 9000)}`;

  // 2. Admin creates a new volunteering activity drive
  console.log(`\n2. Creating new activity drive "${uniqueCode}" (Robotics & AI Workshop)...`);
  const createRes = await axios.post(
    'http://localhost:5000/api/events',
    {
      code: uniqueCode,
      title: 'Robotics & STEM AI Hands-on Workshop for Municipal School Students',
      collegeName: 'Mastercard India',
      location: 'Hinjawadi IT Park, Pune',
      eventDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      description: 'Corporate volunteers mentor 100 municipal school students in building basic robotics kits.',
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  console.log('🎉 EVENT CREATED SUCCESSFULLY BY ADMIN:');
  console.log({
    id: createRes.data.data.id,
    code: createRes.data.data.code,
    title: createRes.data.data.title,
    partner: createRes.data.data.collegeName,
    location: createRes.data.data.location,
  });

  // 3. Verify event appears in live events list
  console.log('\n3. Fetching updated active drives list from database...');
  const listRes = await axios.get('http://localhost:5000/api/events', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`Found ${listRes.data.data.length} total active drives in database.`);
  console.log('Newest Drive Created:', listRes.data.data[0]);
}

main().catch(console.error);
