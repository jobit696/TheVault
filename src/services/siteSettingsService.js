import supabase from '../supabase/supabase-client';

// Ottieni le impostazioni del sito
export async function getSiteSettings() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return data || { disable_related_videos: false };
  } catch (error) {
    console.error('Errore caricamento impostazioni:', error);
    return { disable_related_videos: false };
  }
}

// Aggiorna le impostazioni (solo admin)
export async function updateSiteSettings(settings) {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Impostazioni aggiornate');
    return data;
  } catch (error) {
    console.error('❌ Errore aggiornamento impostazioni:', error);
    throw error;
  }
}