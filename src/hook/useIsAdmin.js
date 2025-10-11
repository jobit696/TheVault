import { useState, useEffect, useContext } from 'react';
import supabase from '../supabase/supabase-client';
import SessionContext from '../context/SessionContext';

export function useIsAdmin() {
  const { session } = useContext(SessionContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (!session?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        setIsAdmin(data?.is_admin === true);
      } catch (error) {
        console.error('Errore controllo admin:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [session]);

  return { isAdmin, loading };
}