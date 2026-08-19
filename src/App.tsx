import { useEffect, useState } from 'react';
import { Auth } from './screens/Auth';
import { BusinessSetup } from './screens/BusinessSetup';
import { HostLive } from './screens/HostLive';
import { JoinLive } from './screens/JoinLive';
import { Landing } from './screens/Landing';
import { TravelerLive } from './screens/TravelerLive';
import { TravelerSetup } from './screens/TravelerSetup';
import { hasSupabase, supabase } from './lib/supabase';

type Screen='landing'|'auth'|'traveler-setup'|'traveler-live'|'business-setup'|'host-live';
type Intent='traveler'|'business';

export default function App(){
  const code=new URLSearchParams(window.location.search).get('session');
  const [screen,setScreen]=useState<Screen>('landing');
  const [intent,setIntent]=useState<Intent>('traveler');
  const [source,setSource]=useState('es');
  const [target,setTarget]=useState('en');
  const [authenticated,setAuthenticated]=useState(!hasSupabase);

  useEffect(()=>{
    if(!supabase)return;
    void supabase.auth.getSession().then(({data})=>setAuthenticated(Boolean(data.session)));
    const {data}=supabase.auth.onAuthStateChange((_event,session)=>setAuthenticated(Boolean(session)));
    return()=>data.subscription.unsubscribe();
  },[]);

  if(code) return <JoinLive code={code.toUpperCase()}/>;

  const enter=(next:Intent)=>{setIntent(next);if(authenticated)setScreen(next==='traveler'?'traveler-setup':'business-setup');else setScreen('auth');};
  if(screen==='landing')return <Landing onTraveler={()=>enter('traveler')} onBusiness={()=>enter('business')} onLogin={()=>{setIntent('traveler');setScreen('auth');}}/>;
  if(screen==='auth')return <Auth onBack={()=>setScreen('landing')} onDone={()=>{setAuthenticated(true);setScreen(intent==='traveler'?'traveler-setup':'business-setup');}}/>;
  if(screen==='traveler-setup')return <TravelerSetup source={source} target={target} onSource={setSource} onTarget={setTarget} onStart={()=>setScreen('traveler-live')} onBack={()=>setScreen('landing')}/>;
  if(screen==='traveler-live')return <TravelerLive source={source} target={target} onExit={()=>setScreen('traveler-setup')}/>;
  if(screen==='business-setup')return <BusinessSetup source={source} onSource={setSource} onStart={()=>setScreen('host-live')} onBack={()=>setScreen('landing')}/>;
  return <HostLive source={source} onExit={()=>setScreen('business-setup')}/>;
}
