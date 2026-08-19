import { ArrowLeft, ArrowRight, QrCode, Users } from 'lucide-react';
import { Logo } from '../components/Logo';
import { LanguageSelect } from '../components/LanguageSelect';
import { hasSupabase } from '../lib/supabase';

type Props = { source:string; onSource:(v:string)=>void; onStart:()=>void; onBack:()=>void };

export function BusinessSetup({ source, onSource, onStart, onBack }: Props) {
  return (
    <main className="business-setup route-enter">
      <header className="setup-nav"><button className="back-button inline" onClick={onBack}><ArrowLeft size={18}/></button><Logo/></header>
      <section className="business-simple-grid">
        <div>
          <span className="micro-label">SESIÓN EN VIVO</span>
          <h1>Una voz.<br/>Todos entienden.</h1>
          <p>Habla una vez. Cada persona escanea un QR y recibe los subtítulos en su propio idioma.</p>
          <div className="business-source"><span>Idioma del hablante</span><LanguageSelect value={source} onChange={onSource}/></div>
          <button className="start-button" onClick={onStart}>Crear sesión <ArrowRight size={22}/></button>
          {!hasSupabase && <small className="setup-note block-note">Modo demo: para compartir entre teléfonos distintos, conecta Supabase con la migración incluida.</small>}
        </div>
        <div className="business-diagram">
          <div className="diagram-host"><Users size={22}/><strong>Guía / anfitrión</strong><small>habla normalmente</small></div>
          <div className="diagram-line"/>
          <div className="diagram-qr"><QrCode size={42}/></div>
          <div className="diagram-line"/>
          <div className="diagram-audience"><span>EN</span><span>FR</span><span>DE</span><span>PT</span></div>
        </div>
      </section>
    </main>
  );
}
