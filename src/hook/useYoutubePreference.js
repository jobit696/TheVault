import { useState, useEffect } from 'react';
import supabase from '../supabase/supabase-client';
import { DEFAULT_CHANNEL_ID } from '../config/youtubeChannels';

export const useYoutubePreference = (userId) => {
  const [channelId, setChannelId] = useState(DEFAULT_CHANNEL_ID);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreference = async () => {
      if (!userId) {
        setChannelId(DEFAULT_CHANNEL_ID);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_youtube_preferences')
          .select('channel_id')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Errore nel caricamento preferenze:', error);
        }

        setChannelId(data?.channel_id || DEFAULT_CHANNEL_ID);
      } catch (err) {
        console.error('Errore:', err);
        setChannelId(DEFAULT_CHANNEL_ID);
      } finally {
        setLoading(false);
      }
    };

    fetchPreference();
  }, [userId]);

  const updateChannelId = async (newChannelId) => {
    if (!userId) {
       return false;
    }

    try {
      // Prima prova a fare l'update
      const { data: existingData, error: selectError } = await supabase
        .from('user_youtube_preferences')
        .select('id')
        .eq('user_id', userId)
        .single();

      let result;
      
      if (existingData) {
        // Se esiste, fai update
        result = await supabase
          .from('user_youtube_preferences')
          .update({
            channel_id: newChannelId,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        // Se non esiste, fai insert
        result = await supabase
          .from('user_youtube_preferences')
          .insert({
            user_id: userId,
            channel_id: newChannelId
          });
      }

      if (result.error) {
             throw result.error;
      }

      setChannelId(newChannelId);
      return true;
    } catch (err) {
      console.error('Errore nell\'aggiornamento:', err);
      return false;
    }
  };

  return { channelId, loading, updateChannelId };
};
