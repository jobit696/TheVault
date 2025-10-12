import supabase from '../supabase/supabase-client';

// Ottieni tutti i giochi featured
export async function getFeaturedGames() {
  try {
    const { data, error } = await supabase
      .from('featured_games')
      .select('*')
      .order('position', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    
    return [];
  }
}

// Aggiungi un gioco ai featured
export async function addFeaturedGame(game) {
  try {
    // Ottieni la posizione massima attuale
    const { data: maxData } = await supabase
      .from('featured_games')
      .select('position')
      .order('position', { ascending: false })
      .limit(1);

    const nextPosition = maxData && maxData.length > 0 ? maxData[0].position + 1 : 1;

    const { data, error } = await supabase
      .from('featured_games')
      .insert({
        game_id: game.id,
        game_name: game.name,
        game_slug: game.slug,
        release_date: game.released,
        position: nextPosition
      })
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    
    throw error;
  }
}

// Rimuovi un gioco dai featured
export async function removeFeaturedGame(gameId) {
  try {
    const { error } = await supabase
      .from('featured_games')
      .delete()
      .eq('game_id', gameId);

    if (error) throw error;
  
    return true;
  } catch (error) {
  
    throw error;
  }
}

// Controlla se un gioco è featured
export async function isFeaturedGame(gameId) {
  try {
    const { data, error } = await supabase
      .from('featured_games')
      .select('id')
      .eq('game_id', gameId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {

    return false;
  }
}