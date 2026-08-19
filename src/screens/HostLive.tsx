import { ChevronLeft, Copy, Mic, Pause, Play, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';
import { speechCodeFor } from '../data/languages';
import { startRecognition, type RecognitionController } from '../lib/speech';
import { supabase } from '../lib/supabase';

type Props = { source:string; onExit:()=>void };

export function HostLive({ source, onExit }: Props) {
  const [code] = useState(()=>Math.random().toString(36).slice(2,8).toUpperCase());
  const [sessionId, setSessionId] = useState<string|null>(null);
  const [caption, setCaption] = useState('Habla cuando estés listo.');
  const [interim, setInterim] = useState('');
  const [listening, setListening] = useState(false);
  const [paused, setPaused] = useState(false);
  const [participants, setParticipants] = useState(0);
  const [notice, setNotice] = useState('');
  const recognition = useRef<RecognitionController|null>(null);
  const joinUrl = `${window.location.origin}${window.location.pathname}?session=${code}`;

  useEffect(()=>{
    if(!supabase) return;
    void supabase.from('live_sessions').insert({code, source_language:source, status:'live'}).select('id').single().then(({data,error})=>{
      if(error) setNotice(error.message); else if(data) setSessionId(data.id);
    });
  },[code,source]);

  useEffect(()=>{
    if(!supabase || !sessionId) return;
    const refresh = async()=>{ const {count}=await supabase!.from('session_participants').select('*',{count:'exact',head:true}).eq('session_id',sessionId); setParticipants(count||0); };
    void refresh();
    const channel = supabase.channel(`participants-${sessionId}`).on('postgres_changes',{event:'*',schema:'public',table:'session_participants',filter:`session_id=eq.${sessionId}`},refresh).subscribe();
    return ()=>{ void supabase!.removeChannel(channel); };
  },[sessionId]);

  const stop=()=>{recognition.current?.stop(); recognition.current=null; setListening(false);};
  const start=()=>{
    stop(); setNotice('');
    recognition.current=startRecognition(speechCodeFor(source),{
      onInterim:setInterim,
      onFinal:async(text)=>{ setInterim(''); setCaption(text); if(supabase && sessionId){const {error}=await supabase.from('live_captions').insert({session_id:sessionId,source_text:text,source_language:source}); if(error)setNotice(error.message);} },
      onState:setListening,
      onError:setNotice
    });
  };
  useEffect(()=>{start(); return stop;},[sessionId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(()=>()=>{ if(supabase && sessionId) void supabase.from('live_sessions').update({status:'ended',ended_at:new Date().toISOString()}).eq('id',sessionId); },[sessionId]);
  const toggle=()=>{if(paused){setPaused(false);start();}else{setPaused(true);stop();}};

  return <main className="host-live route-enter">
    <header className="host-nav"><button onClick={onExit}><ChevronLeft size={18}/> Terminar</button><div className="live-label"><span className={listening?'status-dot':'status-dot idle'}/>{listening?'EN VIVO':'PAUSADO'}</div><span className="participants"><Users size={17}/>{participants}</span></header>
    <section className="host-layout">
      <div className="host-speaking">
        <span className="micro-label">TU VOZ</span>
        <div className="host-caption" key={caption}>{caption}</div>
        {interim && <div className="host-interim"><Mic size={17}/>{interim}</div>}
        <button className="pause-pill" onClick={toggle}>{paused?<><Play size={17}/>Reanudar</>:<><Pause size={17}/>Pausar</>}</button>
      </div>
      <aside className="join-panel">
        <span className="micro-label">PARA QUIENES ESCUCHAN</span>
        <h2>Escanea. Elige idioma. Sigue mirando.</h2>
        <div className="qr-box"><QRCodeSVG value={joinUrl} size={190} level="M"/></div>
        <div className="room-code">{code}</div>
        <button className="copy-button" onClick={()=>navigator.clipboard.writeText(joinUrl)}><Copy size={17}/> Copiar enlace</button>
      </aside>
    </section>
    {notice && <div className="error-pill host-error">{notice}</div>}
  </main>;
}
