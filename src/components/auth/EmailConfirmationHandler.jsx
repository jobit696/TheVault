import { useState, useEffect } from 'react';
import supabase from '../../supabase/supabase-client';

export default function EmailConfirmationHandler() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Gestisce la conferma email automaticamente
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Controlla se è una nuova conferma email
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const type = hashParams.get('type');
          
          if (type === 'signup' || type === 'email') {
            console.log('✅ Email confermata! Utente:', session.user.email);
            setShowConfirmation(true);
            
            // Nascondi il messaggio dopo 5 secondi
            setTimeout(() => {
              setShowConfirmation(false);
            }, 5000);
            
            // Pulisci l'URL dai parametri hash
            window.history.replaceState(null, '', window.location.pathname);
          }
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (!showConfirmation) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(145deg, #28a745, #218838)',
        color: 'white',
        padding: '15px 30px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'slideDown 0.3s ease-out',
        fontWeight: '600'
      }}>
        <i className="fas fa-check-circle" style={{ fontSize: '1.2rem' }}></i>
        Email confirmed successfully! Welcome!
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </>
  );
}