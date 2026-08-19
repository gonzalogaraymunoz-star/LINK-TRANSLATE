import { ArrowRight, Building2, Captions, Mic2 } from 'lucide-react';
import { Logo } from '../components/Logo';

type Props = { onTraveler: () => void; onBusiness: () => void; onLogin: () => void };

export function Landing({ onTraveler, onBusiness, onLogin }: Props) {
  return (
    <main className="landing-page route-enter">
      <header className="landing-nav">
        <Logo />
        <button className="quiet-link" onClick={onLogin}>Ingresar</button>
      </header>

      <section className="landing-hero">
        <div className="hero-copy-simple">
          <span className="micro-label">ENTENDERSE DEBERÍA SER SIMPLE</span>
          <h1>Habla.<br/><em>Entiende.</em><br/>Sigue.</h1>
          <p>Subtítulos y voz en vivo para conversar sin compartir idioma.</p>
          <div className="choice-stack">
            <button className="choice-card primary-choice" onClick={onTraveler}>
              <span className="choice-icon"><Captions size={22}/></span>
              <span><small>USO PERSONAL</small><strong>Quiero subtítulos</strong><em>Prueba gratis · sin configurar nada más</em></span>
              <ArrowRight size={20}/>
            </button>
            <button className="choice-card" onClick={onBusiness}>
              <span className="choice-icon"><Building2 size={22}/></span>
              <span><small>PARA EQUIPOS</small><strong>Crear una sesión en vivo</strong><em>Una voz · muchos idiomas · un QR</em></span>
              <ArrowRight size={20}/>
            </button>
          </div>
        </div>

        <div className="live-preview" aria-hidden="true">
          <div className="preview-top"><span className="pulse-dot"/> EN VIVO</div>
          <div className="preview-caption old">We leave at six in the morning.</div>
          <div className="preview-caption current">Salimos a las seis de la mañana.</div>
          <div className="preview-mic"><Mic2 size={21}/></div>
        </div>
      </section>

      <footer className="minimal-footer"><span>LINK Translate</span><span>Subtítulos · Voz · Sesiones</span></footer>
    </main>
  );
}
