import supabase from '../supabase/supabase-client';

// Ottieni tutti i giochi upcoming ordinati per data
export async function getUpcomingGames() {
  try {
    const { data, error } = await supabase
      .from('upcoming_games')
      .select('*')
      .gte('release_date', new Date().toISOString().split('T')[0]) // Solo giochi futuri
      .order('release_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Errore caricamento upcoming games:', error);
    return [];
  }
}

// Controlla se un gioco è già negli upcoming
export async function isUpcomingGame(gameId) {
  try {
    const { data, error } = await supabase
      .from('upcoming_games')
      .select('id')
      .eq('game_id', gameId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('Errore controllo upcoming game:', error);
    return false;
  }
}

// Aggiungi gioco agli upcoming
export async function addUpcomingGame(game, releaseDate) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('upcoming_games')
      .insert([
        {
          game_id: game.id,
          game_slug: game.slug,
          game_name: game.name,
          game_image: game.background_image,
          release_date: releaseDate,
          added_by: user.id
        }
      ])
      .select()
      .single();

    if (error) throw error;
   
    return data;
  } catch (error) {
  
    throw error;
  }
}

// Rimuovi gioco dagli upcoming
export async function removeUpcomingGame(gameId) {
  try {
    const { error } = await supabase
      .from('upcoming_games')
      .delete()
      .eq('game_id', gameId);

    if (error) throw error;
   
  } catch (error) {
    
    throw error;
  }
}