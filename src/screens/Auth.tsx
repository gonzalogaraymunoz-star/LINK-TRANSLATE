import { ArrowLeft, Mail } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '../components/Logo';
import { hasSupabase, supabase } from '../lib/supabase';

type Props = { onBack: () => void; onDone: () => void };

export function Auth({ onBack, onDone }: Props) {
  const [mode, setMode] = useState<'signup'|'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!supabase) { onDone(); return; }
    setBusy(true); setMessage('');
    const result = mode === 'signup'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) setMessage(result.error.message);
    else if (result.data.session) onDone();
    else setMessage('Revisa tu correo para confirmar la cuenta.');
  };

  return (
    <main className="center-page route-enter">
      <button className="back-button" onClick={onBack}><ArrowLeft size={18}/></button>
      <section className="auth-box">
        <Logo />
        <div className="auth-heading">
          <span className="micro-label">{mode === 'signup' ? 'CREAR CUENTA' : 'BIENVENIDO'}</span>
          <h1>{mode === 'signup' ? 'Entra una vez. Después, solo habla.' : 'Vuelve a entender al instante.'}</h1>
        </div>
        <div className="mini-tabs"><button className={mode==='signup'?'active':''} onClick={()=>setMode('signup')}>Crear cuenta</button><button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Ingresar</button></div>
        {hasSupabase ? <>
          <label className="simple-field"><span>Correo</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com"/></label>
          <label className="simple-field"><span>Contraseña</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="8+ caracteres"/></label>
          <button className="big-button" disabled={busy || !email || !password} onClick={submit}>{busy?'Entrando…':mode==='signup'?'Crear cuenta':'Ingresar'} <ArrowRightIcon/></button>
          <button className="magic-link" disabled={!email} onClick={async()=>{ if(!supabase)return; setBusy(true); const {error}=await supabase.auth.signInWithOtp({email, options:{emailRedirectTo:window.location.origin}}); setBusy(false); setMessage(error?error.message:'Te enviamos un enlace de acceso.'); }}><Mail size={17}/> Enviarme un enlace</button>
        </> : <>
          <div className="demo-note">Autenticación demo. Al conectar Supabase, esta misma pantalla crea usuarios reales.</div>
          <button className="big-button" onClick={onDone}>Entrar a la demo <ArrowRightIcon/></button>
        </>}
        {message && <div className="form-message">{message}</div>}
      </section>
    </main>
  );
}

function ArrowRightIcon(){ return <span aria-hidden="true">→</span>; }
