import axios from 'axios';

export class GeminiService {
  private static getApiKey(): string {
    return process.env.GEMINI_API_KEY || '';
  }

  /**
   * Translate Hindi or Marathi volunteer feedback to English using Google Gemini 3.6 Flash API
   */
  public static async translateToEnglish(text: string, sourceLang: string): Promise<string> {
    if (!text || sourceLang === 'en') return text;

    try {
      const apiKey = this.getApiKey();
      if (!apiKey) return text;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

      const prompt = `Translate the following ${sourceLang} text into one single, clear English sentence for a corporate CSR report. Provide ONLY the translated English sentence, with no commentary or quotes.\n\n${sourceLang} Text:\n"${text}"`;

      const response = await axios.post(
        url,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!raw) return text;

      let clean = raw.replace(/^["'“”`]+|["'“”`]+$/g, '').trim();
      if (clean.includes('\n')) {
        const lines = clean
          .split('\n')
          .map((l) => l.replace(/^["'“”`]+|["'“”`]+$/g, '').trim())
          .filter((l) => l && !l.startsWith('*') && !l.startsWith('#') && !l.toLowerCase().includes('option'));
        if (lines.length > 0) clean = lines[0];
      }

      return clean || text;
    } catch (err: any) {
      console.warn('[GeminiService] Translation Notice:', err?.response?.data || err?.message);
      return text;
    }
  }
}
