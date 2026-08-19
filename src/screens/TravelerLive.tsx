import { ChevronLeft, Mic, MicOff, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { nativeName, speechCodeFor } from '../data/languages';
import { addUsageSecond, freeLimitSeconds, getUsageSeconds } from '../lib/usage';
import { startRecognition, type RecognitionController } from '../lib/speech';
import { translateText } from '../lib/translate';

type Props = { source:string; target:string; onExit:()=>void };

export function TravelerLive({ source, target, onExit }: Props) {
  const [current, setCurrent] = useState('Empieza a hablar.');
  const [previous, setPrevious] = useState('');
  const [original, setOriginal] = useState('');
  const [interim, setInterim] = useState('');
  const [listening, setListening] = useState(false);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState('');
  const [controls, setControls] = useState(true);
  const [used, setUsed] = useState(getUsageSeconds());
  const [paywall, setPaywall] = useState(getUsageSeconds() >= freeLimitSeconds());
  const recognition = useRef<RecognitionController | null>(null);
  const controlTimer = useRef<number | null>(null);

  const stop = () => { recognition.current?.stop(); recognition.current = null; setListening(false); };
  const start = () => {
    if (paywall) return;
    stop(); setError('');
    recognition.current = startRecognition(speechCodeFor(source), {
      onInterim: setInterim,
      onFinal: async (text) => {
        setInterim(''); setOriginal(text);
        try {
          const translated = await translateText({ text, sourceLanguage: source, targetLanguage: target, mode: 'caption' });
          setCurrent(prev => { setPrevious(prev); return translated; });
        } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo traducir.'); }
      },
      onState: setListening,
      onError: setError
    });
  };

  useEffect(() => { start(); return stop; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!listening || paused || paywall) return;
    const id = window.setInterval(() => {
      const next = addUsageSecond(); setUsed(next);
      if (next >= freeLimitSeconds()) { setPaywall(true); stop(); }
    }, 1000);
    return () => window.clearInterval(id);
  }, [listening, paused, paywall]);

  const showControls = () => {
    setControls(true);
    if (controlTimer.current) window.clearTimeout(controlTimer.current);
    controlTimer.current = window.setTimeout(()=>setControls(false), 2300);
  };
  const toggle = () => { if (paused) { setPaused(false); start(); } else { setPaused(true); stop(); } };
  const secondsLeft = Math.max(0, freeLimitSeconds() - used);

  return (
    <main className="subtitle-screen" onClick={showControls} onMouseMove={showControls}>
      <header className={controls ? 'floating-controls show' : 'floating-controls'}>
        <button onClick={onExit}><ChevronLeft size={18}/> Salir</button>
        <div className="live-label"><span className={listening?'status-dot':'status-dot idle'}/>{listening?'ESCUCHANDO':paused?'PAUSADO':'LISTO'}</div>
        <button className="round-control" onClick={(e)=>{e.stopPropagation();toggle();}}>{paused?<Play size={18}/>:<Pause size={18}/>}</button>
      </header>

      <section className="subtitle-stage">
        <div className="source-whisper">{original || interim}</div>
        <div className="caption-history" key={`prev-${previous}`}>{previous}</div>
        <div className="caption-main" key={current}>{current}</div>
        {interim && <div className="listening-wave"><span/><span/><span/></div>}
      </section>

      <footer className={controls ? 'subtitle-footer show' : 'subtitle-footer'}>
        <span>{nativeName(source)} → {nativeName(target)}</span>
        <span>{Math.max(1, Math.ceil(secondsLeft/60))} min gratis</span>
      </footer>
      {error && <div className="error-pill"><MicOff size={16}/>{error}</div>}

      {paywall && <div className="paywall-layer">
        <section className="paywall-simple route-enter">
          <span className="micro-label">TU PRUEBA TERMINÓ</span>
          <h2>Seguir entendiendo.</h2>
          <p>Activa subtítulos personales sin el límite de prueba.</p>
          <button className="start-button">Continuar con Pro <span>→</span></button>
          <button className="quiet-link light-link" onClick={onExit}>Ahora no</button>
        </section>
      </div>}

      {!listening && !paused && !paywall && <button className="mic-resume" onClick={(e)=>{e.stopPropagation();start();}}><Mic size={22}/></button>}
    </main>
  );
}
