export type TranslatePayload = {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  mode?: 'caption' | 'conversation';
};

export async function translateText(payload: TranslatePayload): Promise<string> {
  if (payload.sourceLanguage === payload.targetLanguage) return payload.text;
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || 'No se pudo traducir.');
  return data.translation;
}

export function speakText(text: string, lang: string) {
  if (!('speechSynthesis' in window) || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.98;
  window.speechSynthesis.speak(utterance);
}
