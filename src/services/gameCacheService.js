import supabase from '../supabase/supabase-client';
import { getCurrentRawgApiKey, rotateRawgApiKey, getTotalRawgKeys } from '../utils/apiKeyRotation';

const BASE_URL = import.meta.env.VITE_RAW_G_URL;
const FETCH_TIMEOUT = 4000; // 8 secondi

// Fetch con timeout e retry
async function fetchFromRAWG(url, retries = 0) {
  const maxRetries = getTotalRawgKeys();
  const API_KEY = getCurrentRawgApiKey();
  const urlWithKey = url.includes('?') 
    ? `${url}&key=${API_KEY}` 
    : `${url}?key=${API_KEY}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(urlWithKey, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if ((response.status === 429 || response.status === 403) && retries < maxRetries - 1) {
      console.warn(`⚠️ RAWG Key esaurita, provo la successiva...`);
      rotateRawgApiKey();
      return fetchFromRAWG(url, retries + 1);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.warn('⏱️ Timeout RAWG API');
      if (retries < maxRetries - 1) {
        rotateRawgApiKey();
        return fetchFromRAWG(url, retries + 1);
      }
    }
    
    if (retries < maxRetries - 1) {
      console.warn(`⚠️ Errore, provo altra chiave...`);
      rotateRawgApiKey();
      return fetchFromRAWG(url, retries + 1);
    }
    
    throw error;
  }
}

// ========== CACHE FUNCTIONS - OTTIMIZZATE ==========

async function getGameFromCache(gameId) {
  const { data, error } = await supabase
    .from('games_cache')
    .select('*')
    .eq('id', gameId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Errore lettura cache:', error);
    return null;
  }

  if (data) {
    // Aggiorna statistiche in background (non blocca)
    supabase
      .from('games_cache')
      .update({
        view_count: data.view_count + 1,
        last_viewed_at: new Date().toISOString()
      })
      .eq('id', gameId)
      .then(() => console.log('📊 Statistiche aggiornate'));

    console.log('✅ Gioco trovato in cache Supabase');
  }

  return data;
}

async function saveGameToCache(gameData) {
  try {
    const { error } = await supabase
      .from('games_cache')
      .upsert({
        id: gameData.id,
        slug: gameData.slug,
        name: gameData.name,
        name_original: gameData.name_original,
        description: gameData.description,
        description_raw: gameData.description_raw,
        background_image: gameData.background_image,
        background_image_additional: gameData.background_image_additional,
        rating: gameData.rating,
        rating_top: gameData.rating_top,
        ratings: gameData.ratings,
        ratings_count: gameData.ratings_count,
        reviews_count: gameData.reviews_count,
        released: gameData.released,
        tba: gameData.tba,
        metacritic: gameData.metacritic,
        metacritic_platforms: gameData.metacritic_platforms,
        playtime: gameData.playtime,
        suggestions_count: gameData.suggestions_count,
        updated: gameData.updated,
        user_game: gameData.user_game,
        reviews_text_count: gameData.reviews_text_count,
        added: gameData.added,
        added_by_status: gameData.added_by_status,
        parent_platforms: gameData.parent_platforms,
        platforms: gameData.platforms,
        stores: gameData.stores,
        genres: gameData.genres,
        tags: gameData.tags,
        developers: gameData.developers,
        publishers: gameData.publishers,
        esrb_rating: gameData.esrb_rating,
        clip: gameData.clip,
        website: gameData.website,
        reddit_url: gameData.reddit_url,
        reddit_name: gameData.reddit_name,
        reddit_description: gameData.reddit_description,
        reddit_logo: gameData.reddit_logo,
        reddit_count: gameData.reddit_count,
        twitch_count: gameData.twitch_count,
        youtube_count: gameData.youtube_count,
        alternative_names: gameData.alternative_names,
        metacritic_url: gameData.metacritic_url,
        parents_count: gameData.parents_count,
        additions_count: gameData.additions_count,
        game_series_count: gameData.game_series_count,
        full_data: gameData,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('❌ Errore salvataggio gioco:', error);
    return false;
  }
}

async function getScreenshotsFromCache(gameId) {
  const { data } = await supabase
    .from('game_screenshots_cache')
    .select('image, width, height')
    .eq('game_id', gameId)
    .eq('is_deleted', false);
  return data || [];
}

async function saveScreenshotsToCache(gameId, screenshots) {
  if (!screenshots?.length) return true;
  
  try {
    await supabase.from('game_screenshots_cache').delete().eq('game_id', gameId);
    
    const data = screenshots.map(ss => ({
      game_id: gameId,
      image: ss.image,
      width: ss.width,
      height: ss.height
    }));

    await supabase.from('game_screenshots_cache').insert(data);
    return true;
  } catch (error) {
    console.error('❌ Errore screenshots:', error);
    return false;
  }
}

async function getDLCsFromCache(gameId) {
  const { data } = await supabase
    .from('game_dlcs_cache')
    .select('full_data')
    .eq('parent_game_id', gameId);
  return data?.map(d => d.full_data) || [];
}

async function saveDLCsToCache(gameId, dlcs) {
  if (!dlcs?.length) return true;
  
  try {
    const data = dlcs.map(dlc => ({
      id: dlc.id,
      parent_game_id: gameId,
      name: dlc.name,
      slug: dlc.slug,
      background_image: dlc.background_image,
      rating: dlc.rating,
      released: dlc.released,
      full_data: dlc
    }));

    await supabase.from('game_dlcs_cache').upsert(data, { onConflict: 'id' });
    return true;
  } catch (error) {
    console.error('❌ Errore DLC:', error);
    return false;
  }
}

async function getSimilarGamesFromCache(gameId) {
  const { data } = await supabase
    .from('game_similar_cache')
    .select('full_data')
    .eq('game_id', gameId);
  return data?.map(s => s.full_data) || [];
}

async function saveSimilarGamesToCache(gameId, similarGames) {
  if (!similarGames?.length) return true;
  
  try {
    await supabase.from('game_similar_cache').delete().eq('game_id', gameId);
    
    const data = similarGames.map(game => ({
      game_id: gameId,
      similar_game_id: game.id,
      similar_game_name: game.name,
      similar_game_slug: game.slug,
      similar_game_image: game.background_image,
      similar_game_rating: game.rating,
      full_data: game
    }));

    await supabase.from('game_similar_cache').insert(data);
    return true;
  } catch (error) {
    console.error('❌ Errore similar games:', error);
    return false;
  }
}

async function getClipsFromCache(gameId) {
  const { data } = await supabase
    .from('game_clips_cache')
    .select('*')
    .eq('game_id', gameId)
    .limit(1);
  return data || [];
}

async function saveClipsToCache(gameId, clip) {
  if (!clip) return true;
  
  try {
    await supabase.from('game_clips_cache').upsert({
      game_id: gameId,
      clip_url: clip.clip,
      video_url: clip.clips?.['320'] || clip.clips?.['640'] || clip.clips?.full,
      preview_url: clip.preview,
      clip_data: clip
    }, { onConflict: 'game_id' });
    return true;
  } catch (error) {
    console.error('❌ Errore clips:', error);
    return false;
  }
}

// ========== FUNZIONE PRINCIPALE SUPER OTTIMIZZATA ==========

export async function getGameDetails(gameId) {
  // 1. Controlla cache
  const cachedGame = await getGameFromCache(gameId);
  
  if (cachedGame) {
    // Carica dati correlati in parallelo
    const [screenshots, dlcs, similarGames, clips] = await Promise.all([
      getScreenshotsFromCache(gameId),
      getDLCsFromCache(gameId),
      getSimilarGamesFromCache(gameId),
      getClipsFromCache(gameId)
    ]);

    return {
      game: cachedGame.full_data || cachedGame,
      screenshots,
      dlcs,
      similarGames,
      clips,
      fromCache: true
    };
  }

  // 2. Fetch da RAWG - OTTIMIZZATO
  console.log('🌐 Fetch RAWG per gioco:', gameId);
  
  const gameUrl = `${BASE_URL}/games/${gameId}`;
  const screenshotsUrl = `${BASE_URL}/games/${gameId}/screenshots`;
  
  // Fetch sicuro per endpoint opzionali
  const safeFetch = async (url) => {
    try {
      return await fetchFromRAWG(url);
    } catch {
      return { results: [] };
    }
  };

  try {
    // Fai prima le chiamate essenziali
    const [gameData, screenshotsData] = await Promise.all([
      fetchFromRAWG(gameUrl),
      fetchFromRAWG(screenshotsUrl)
    ]);
    
    // Poi le opzionali (DLC e similar) - non bloccano se falliscono
    const [dlcData, similarData] = await Promise.all([
      safeFetch(`${BASE_URL}/games/${gameId}/additions`),
      safeFetch(`${BASE_URL}/games/${gameId}/game-series`)
    ]);

    // Salva tutto in parallelo
    await Promise.all([
      saveGameToCache(gameData),
      saveScreenshotsToCache(gameId, screenshotsData.results || []),
      saveDLCsToCache(gameId, dlcData.results || []),
      saveSimilarGamesToCache(gameId, similarData.results || []),
      saveClipsToCache(gameId, gameData.clip)
    ]);

    return {
      game: gameData,
      screenshots: screenshotsData.results || [],
      dlcs: dlcData.results || [],
      similarGames: similarData.results || [],
      clips: gameData.clip ? [gameData.clip] : [],
      fromCache: false
    };
  } catch (error) {
    console.error('❌ Errore RAWG:', error);
    throw error;
  }
}