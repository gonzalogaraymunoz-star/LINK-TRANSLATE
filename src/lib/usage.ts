const KEY = 'link_translate_free_seconds_v2';

export function freeLimitSeconds() {
  return Math.max(1, Number(import.meta.env.VITE_FREE_MINUTES || 3)) * 60;
}

export function getUsageSeconds() {
  return Number(localStorage.getItem(KEY) || 0);
}

export function addUsageSecond() {
  const next = getUsageSeconds() + 1;
  localStorage.setItem(KEY, String(next));
  return next;
}
