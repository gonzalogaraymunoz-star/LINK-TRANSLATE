export type Language = {
  code: string;
  native: string;
  speechCode: string;
};

export const languages: Language[] = [
  { code: 'es', native: 'Español', speechCode: 'es-CL' },
  { code: 'en', native: 'English', speechCode: 'en-US' },
  { code: 'pt', native: 'Português', speechCode: 'pt-BR' },
  { code: 'fr', native: 'Français', speechCode: 'fr-FR' },
  { code: 'de', native: 'Deutsch', speechCode: 'de-DE' },
  { code: 'it', native: 'Italiano', speechCode: 'it-IT' },
  { code: 'zh', native: '中文', speechCode: 'zh-CN' },
  { code: 'ja', native: '日本語', speechCode: 'ja-JP' },
  { code: 'ko', native: '한국어', speechCode: 'ko-KR' }
];

export function speechCodeFor(code: string) {
  return languages.find((item) => item.code === code)?.speechCode || 'en-US';
}

export function nativeName(code: string) {
  return languages.find((item) => item.code === code)?.native || code.toUpperCase();
}
