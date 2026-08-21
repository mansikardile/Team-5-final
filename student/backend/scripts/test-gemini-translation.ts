import axios from 'axios';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('GEMINI_API_KEY env var not set.');
    return;
  }

  const textToTranslate = 'मनपा शाळेतील विद्यार्थ्यांसाठी सायन्स किट तयार करणे खूप छान अनुभव होता. सेवासहयोग टीमचे नियोजन उत्कृष्ट होते.';
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
    const res = await axios.post(
      url,
      {
        contents: [
          {
            parts: [
              {
                text: `Translate the following Marathi text into clear English for a corporate CSR report:\n"${textToTranslate}"`,
              },
            ],
          },
        ],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('🎉 SUCCESS with model gemini-3.6-flash:');
    console.log(text);
  } catch (err: any) {
    console.warn('❌ Gemini translation failed:', err?.response?.data?.error?.message || err.message);
  }
}

main();
