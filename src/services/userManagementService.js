import supabase from '../supabase/supabase-client';

// Ottieni tutti gli utenti (solo admin)
export async function getAllUsers() {
  try {
   
    const { data: profiles, error: profilesError } = await supabase
      .rpc('get_all_users_with_email');

    if (profilesError) {
    
      throw profilesError;
    }

    if (!profiles) {
      console.warn('Nessun utente trovato');
      return [];
    }

    // Controlla quali utenti sono bannati
    const { data: bannedUsers, error: bannedError } = await supabase
      .from('banned_users')
      .select('user_id, banned_at, reason');

    if (bannedError) {
     
      throw bannedError;
    }

    // Combina le informazioni
    const bannedMap = new Map(bannedUsers?.map(b => [b.user_id, b]) || []);
    
    const usersWithBanStatus = profiles.map(profile => ({
      ...profile,
      isBanned: bannedMap.has(profile.id),
      bannedInfo: bannedMap.get(profile.id) || null
    }));

    return usersWithBanStatus;
  } catch (error) {
    
    throw error;
  }
}

// Banna un utente
export async function banUser(userId, reason = '') {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('banned_users')
      .insert([
        {
          user_id: userId,
          banned_by: user.id,
          reason: reason
        }
      ]);

    if (error) throw error;


  } catch (error) {
    
    throw error;
  }
}

// Rimuovi ban da un utente
export async function unbanUser(userId) {
  try {
    const { error } = await supabase
      .from('banned_users')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

   
  } catch (error) {
    
    throw error;
  }
}

// Controlla se un utente è bannato
export async function isUserBanned(userId) {
  try {
    const { data, error } = await supabase
      .from('banned_users')
      .select('banned_at')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('Errore controllo ban:', error);
    return false;
  }
}