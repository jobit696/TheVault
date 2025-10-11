import supabase from '../supabase/supabase-client';

// Chiave localStorage per tracciare visite uniche per sessione
const VISIT_KEY = 'site_visit_tracked';
const VISIT_DATE_KEY = 'site_visit_date';

export async function trackVisit() {
  try {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem(VISIT_DATE_KEY);
    
    // Se ha già visitato oggi, non tracciare di nuovo
    if (lastVisit === today) {
      console.log('✅ Visita già tracciata oggi');
      return;
    }

    // Chiama la funzione Postgres per incrementare
    const { error } = await supabase.rpc('increment_site_visits');
    
    if (error) throw error;

    // Salva che ha visitato oggi
    localStorage.setItem(VISIT_DATE_KEY, today);
    localStorage.setItem(VISIT_KEY, 'true');
    
    console.log('📊 Visita tracciata con successo');
  } catch (error) {
    console.error('❌ Errore tracking visita:', error);
  }
}

export async function getSiteStats() {
  try {
    const { data, error } = await supabase
      .from('site_stats')
      .select('total_visits, unique_daily_visits')
      .eq('id', 1)
      .single();

    if (error) throw error;
    
    return {
      totalVisits: data?.total_visits || 0,
      dailyVisits: data?.unique_daily_visits || 0
    };
  } catch (error) {
    console.error('❌ Errore recupero stats:', error);
    return { totalVisits: 0, dailyVisits: 0 };
  }
}