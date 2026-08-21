import axios from 'axios';

async function main() {
  const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
    email: 'nikhil.rane@mastercard.com',
    password: 'Volunteer@123',
  });

  const token = loginRes.data.data.token;

  console.log('1. Submitting Hindi feedback for Nikhil Rane with Google Gemini 3.6 Flash translation...');

  const fbRes = await axios.post(
    'http://localhost:5001/api/feedback',
    {
      activityCode: 'SEVA-PUNE-KIT-01',
      experience: 'मनपा स्कूल के बच्चों के लिए साइंस किट तैयार करना बहुत अच्छा अनुभव रहा। सेवा सहयोग टीम का प्रबंधन उत्कृष्ट था।',
      rating: 5,
      suggestion: 'अगली बार वर्कशॉप शुरू करने से पहले 3 मिनट का वीडियो डेमो दिखाया जाना चाहिए।',
      language: 'hi',
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  console.log('🎉 LIVE GEMINI TRANSLATION RESPONSE:');
  console.log({
    originalHindiExp: fbRes.data.data.experience,
    translatedEnglishExp: fbRes.data.data.translatedExperience,
    originalHindiSugg: fbRes.data.data.suggestion,
    translatedEnglishSugg: fbRes.data.data.translatedSuggestion,
  });
}

main().catch(console.error);
