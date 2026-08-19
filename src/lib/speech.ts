export type RecognitionController = { stop: () => void };

type Callbacks = {
  onInterim: (text: string) => void;
  onFinal: (text: string) => void;
  onState: (active: boolean) => void;
  onError: (message: string) => void;
};

export function startRecognition(lang: string, callbacks: Callbacks): RecognitionController | null {
  const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Recognition) {
    callbacks.onError('El reconocimiento de voz necesita Chrome o Safari actualizado.');
    return null;
  }

  const recognition = new Recognition();
  recognition.lang = lang;
  recognition.continuous = true;
  recognition.interimResults = true;
  let stopped = false;

  recognition.onstart = () => callbacks.onState(true);
  recognition.onresult = (event: any) => {
    let interim = '';
    let finalText = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i];
      const transcript = result[0]?.transcript || '';
      if (result.isFinal) finalText += transcript;
      else interim += transcript;
    }
    callbacks.onInterim(interim.trim());
    if (finalText.trim()) callbacks.onFinal(finalText.trim());
  };
  recognition.onerror = (event: any) => {
    if (event?.error === 'no-speech') return;
    callbacks.onError(event?.error === 'not-allowed' ? 'Activa el permiso del micrófono.' : `Micrófono: ${event?.error || 'error'}.`);
  };
  recognition.onend = () => {
    callbacks.onState(false);
    if (!stopped) {
      window.setTimeout(() => {
        try { recognition.start(); } catch { /* browser restart race */ }
      }, 220);
    }
  };

  try { recognition.start(); } catch { callbacks.onError('No se pudo iniciar el micrófono.'); }
  return {
    stop: () => {
      stopped = true;
      try { recognition.stop(); } catch { /* noop */ }
      callbacks.onState(false);
    }
  };
}
