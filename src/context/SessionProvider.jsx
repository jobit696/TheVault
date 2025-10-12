import { useState, useEffect, useRef } from "react";
import SessionContext from "./SessionContext";
import supabase from "../supabase/supabase-client";
import { isUserBanned } from "../services/userManagementService";

export default function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const checkingBan = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Controllo ban ogni 2 minuti
  useEffect(() => {
    if (!session?.user) {
      checkingBan.current = false;
      return;
    }

    const checkBanStatus = async () => {
      if (checkingBan.current) return;
      if (!session?.user) return;

      checkingBan.current = true;

      try {
        const banned = await isUserBanned(session.user.id);
        
        if (banned) {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          
          if (currentSession) {
            console.log('User is banned, logging out...');
            await supabase.auth.signOut();
            alert('Your account has been banned. Please contact support.');
          }
        }
      } catch (error) {
        console.error('Error checking ban status:', error);
      } finally {
        checkingBan.current = false;
      }
    };

    const timeout = setTimeout(checkBanStatus, 120000);
    const interval = setInterval(checkBanStatus, 120000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      checkingBan.current = false;
    };
  }, [session]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="loader-spinner-large"></div>
        <p style={{ color: 'white' }}>Loading...</p>
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}