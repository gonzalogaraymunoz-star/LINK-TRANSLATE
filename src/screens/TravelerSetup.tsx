import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { LanguageSelect } from '../components/LanguageSelect';

type Props = { source:string; target:string; onSource:(v:string)=>void; onTarget:(v:string)=>void; onStart:()=>void; onBack:()=>void };

export function TravelerSetup({ source, target, onSource, onTarget, onStart, onBack }: Props) {
  return (
    <main className="setup-page route-enter">
      <header className="setup-nav"><button className="back-button inline" onClick={onBack}><ArrowLeft size={18}/></button><Logo/></header>
      <section className="setup-content">
        <span className="micro-label">UN SOLO PASO</span>
        <h1>¿Qué quieres entender?</h1>
        <div className="sentence-picker">
          <span>Yo hablo</span><LanguageSelect value={source} onChange={onSource}/>
          <span>y quiero leer</span><LanguageSelect value={target} onChange={onTarget}/>
        </div>
        <button className="start-button" onClick={onStart}>Empezar <ArrowRight size={22}/></button>
        <p className="setup-note">La pantalla siguiente solo escucha y subtitula. Toca una vez si necesitas ver los controles.</p>
      </section>
    </main>
  );
}
