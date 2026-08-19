const LANGUAGE_NAMES = {
  es: 'Spanish', en: 'English', pt: 'Portuguese', fr: 'French', de: 'German', it: 'Italian', zh: 'Mandarin Chinese', ja: 'Japanese', ko: 'Korean'
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  const { text, sourceLanguage = 'es', targetLanguage = 'en', mode = 'caption' } = req.body || {};
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Falta texto.' });
  if (text.length > 3000) return res.status(400).json({ error: 'Texto demasiado largo.' });

  const apiUrl = (process.env.TRANSLATE_API_URL || '').replace(/\/$/, '');
  const apiKey = process.env.TRANSLATE_API_KEY;
  const model = process.env.TRANSLATE_MODEL;
  if (!apiUrl || !apiKey || !model) return res.status(503).json({ error: 'Falta configurar el proveedor de traducción en Vercel.' });

  const source = LANGUAGE_NAMES[sourceLanguage] || sourceLanguage;
  const target = LANGUAGE_NAMES[targetLanguage] || targetLanguage;
  const system = [
    `Translate spoken ${source} into natural ${target}.`,
    'Return only the translation, never an explanation.',
    'This text will appear as live subtitles during a real conversation.',
    'Preserve names, numbers, times, prices and places exactly.',
    'Prefer short, natural phrasing that can be read instantly.',
    mode === 'conversation' ? 'Maintain conversational tone and intent.' : 'Optimize for subtitle readability.'
  ].join(' ');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const upstream = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
      body: JSON.stringify({ model, temperature: 0.1, messages: [{ role: 'system', content: system }, { role: 'user', content: text }] })
    });
    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error('provider', upstream.status, detail.slice(0, 400));
      return res.status(502).json({ error: 'El servicio de traducción no respondió.' });
    }
    const data = await upstream.json();
    const translation = data?.choices?.[0]?.message?.content?.trim();
    if (!translation) return res.status(502).json({ error: 'No llegó una traducción.' });
    return res.status(200).json({ translation });
  } catch (error) {
    console.error(error);
    return res.status(error?.name === 'AbortError' ? 504 : 500).json({ error: error?.name === 'AbortError' ? 'La traducción tardó demasiado.' : 'Error interno al traducir.' });
  } finally { clearTimeout(timeout); }
}
