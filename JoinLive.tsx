import { Headphones } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LanguageSelect } from '../components/LanguageSelect';
import { nativeName } from '../data/languages';
import { supabase } from '../lib/supabase';
import { translateText } from '../lib/translate';

type Props = { code:string };

export function JoinLive({ code }: Props) {
  const [target,setTarget]=useState('en');
  const [joined,setJoined]=useState(false);
  const [sessionId,setSessionId]=useState<string|null>(null);
  const [source,setSource]=useState('es');
  const [current,setCurrent]=useState('Esperando al anfitrión…');
  const [previous,setPrevious]=useState('');
  const [error,setError]=useState('');

  const join=async()=>{
    const client = supabase;
    if(!client){
      setJoined(true);
      setCurrent('Demo lista. Con Supabase conectado, aquí llegarán los subtítulos en tiempo real.');
      return;
    }

    const {data,error:findError}=await client
      .from('live_sessions')
      .select('id,source_language,status')
      .eq('code',code)
      .eq('status','live')
      .maybeSingle();

    if(findError||!data){
      setError(findError?.message||'La sesión ya no está disponible.');
      return;
    }

    setSessionId(data.id);
    setSource(data.source_language);
    setJoined(true);

    await client
      .from('session_participants')
      .insert({session_id:data.id,target_language:target});
  };

  useEffect(()=>{
    const client = supabase;
    if(!client||!sessionId||!joined) return;

    const channel=client
      .channel(`captions-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event:'INSERT',
          schema:'public',
          table:'live_captions',
          filter:`session_id=eq.${sessionId}`
        },
        async(payload)=>{
          try{
            const translated=await translateText({
              text:payload.new.source_text as string,
              sourceLanguage:source,
              targetLanguage:target,
              mode:'caption'
            });

            setCurrent(prev=>{
              setPrevious(prev);
              return translated;
            });
          }catch(err){
            setError(err instanceof Error ? err.message : 'No se pudo traducir.');
          }
        }
      )
      .subscribe();

    return()=>{
      void client.removeChannel(channel);
    };
  },[sessionId,joined,source,target]);

  if(!joined) {
    return (
      <main className="join-simple route-enter">
        <section>
          <span className="micro-label">SESIÓN {code}</span>
          <h1>¿En qué idioma quieres leer?</h1>
          <LanguageSelect value={target} onChange={setTarget}/>
          <button className="start-button" onClick={join}>
            Entrar <span>→</span>
          </button>
          <p>No necesitas cuenta.</p>
          {error&&<div className="form-message">{error}</div>}
        </section>
      </main>
    );
  }

  return (
    <main className="participant-screen">
      <div className="participant-language">
        <Headphones size={16}/>
        {nativeName(target)}
      </div>

      <section className="subtitle-stage">
        <div className="caption-history">{previous}</div>
        <div className="caption-main" key={current}>{current}</div>
      </section>

      {error&&<div className="error-pill">{error}</div>}
    </main>
  );
}
