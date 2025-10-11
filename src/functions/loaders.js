import { cache } from '../utils/cache';
import { getCurrentRawgApiKey, rotateRawgApiKey, getTotalRawgKeys } from '../utils/apiKeyRotation';
import { getGameDetails as getGameDetailsFromDB } from '../services/gameCacheService';

const BASE_URL = import.meta.env.VITE_RAW_G_URL;
const FETCH_TIMEOUT = 10000; // 10 secondi timeout

// Helper con timeout
async function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}

// Helper function per fetch CON CACHE e ROTAZIONE KEY
async function fetchFromAPI(url, cacheKey, retries = 0) {
    const maxRetries = getTotalRawgKeys();

    // Prova a recuperare dalla cache in-memory
    const cached = cache.get(cacheKey);
    if (cached) {
        console.log(`⚡ Cache hit: ${cacheKey}`);
        return cached;
    }

    const API_KEY = getCurrentRawgApiKey();
    const urlWithKey = url.includes('?') 
        ? `${url}&key=${API_KEY}` 
        : `${url}?key=${API_KEY}`;

    try {
        const response = await fetchWithTimeout(urlWithKey);
        
        if ((response.status === 429 || response.status === 403) && retries < maxRetries - 1) {
            console.warn(`⚠️ RAWG Key #${retries + 1} esaurita, provo la successiva...`);
            rotateRawgApiKey();
            return fetchFromAPI(url, cacheKey, retries + 1);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        cache.set(cacheKey, data);
        
        return data;
    } catch (error) {
        if (retries < maxRetries - 1 && error.message !== 'Request timeout') {
            console.warn(`⚠️ Errore con RAWG key #${retries + 1}, provo la successiva...`);
            rotateRawgApiKey();
            return fetchFromAPI(url, cacheKey, retries + 1);
        }
        throw error;
    }
}

// Giochi popolari
export async function getPopularGames() {
    const today = new Date();
    const past30Days = new Date();
    past30Days.setDate(today.getDate() - 30);
    const formatDate = (date) => date.toISOString().split('T')[0];
    const startDate = formatDate(past30Days);
    const endDate = formatDate(today);
    const url = `${BASE_URL}/games?dates=${startDate},${endDate}&ordering=-released,-rating&page_size=10`;
    return fetchFromAPI(url, `popular_${startDate}_${endDate}`);
}

// Tutti i giochi 
export async function getAllGames({ request }) {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || 1;
    const apiUrl = `${BASE_URL}/games?page=${page}&page_size=20`;
    return fetchFromAPI(apiUrl, `all_games_page_${page}`);
}

// Giochi per piattaforma
export async function getGamesByPlatform({ params, request }) {
    const { platformId } = params;
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || 1;
    const apiUrl = `${BASE_URL}/games?platforms=${platformId}&page=${page}&page_size=20`;
    return fetchFromAPI(apiUrl, `platform_${platformId}_page_${page}`);
}

// ========== OTTIMIZZATO: USA SUPABASE CACHE ==========
export async function getGameDetails({ params }) {
    const { id } = params;
    
    // Controlla prima la cache in-memory
    const memoryCacheKey = `game_full_${id}`;
    const memoryCache = cache.get(memoryCacheKey);
    if (memoryCache) {
        console.log(`⚡ Gioco #${id} da cache in-memory`);
        return memoryCache;
    }
    
    try {
        console.time(`⏱️ Caricamento gioco #${id}`);
        
        // Usa il service con Supabase (controlla DB prima, poi RAWG)
        const data = await getGameDetailsFromDB(id);
        
        console.timeEnd(`⏱️ Caricamento gioco #${id}`);
        
        // Log per debug
        if (data.fromCache) {
            console.log(`💾 Gioco #${id} caricato da Supabase`);
        } else {
            console.log(`🌐 Gioco #${id} caricato da RAWG e salvato in Supabase`);
        }
        
        const result = {
            game: data.game,
            screenshots: data.screenshots || [],
            dlcs: data.dlcs || [],
            similarGames: data.similarGames || [],
            clips: data.clips || [],
            fromCache: data.fromCache
        };
        
        // Salva anche in cache in-memory per accesso ultra-rapido
        cache.set(memoryCacheKey, result, 3600000); // 1 ora
        
        return result;
        
    } catch (error) {
        console.error(`❌ Errore caricamento gioco #${id}:`, error);
        console.timeEnd(`⏱️ Caricamento gioco #${id}`);
        
        // NON fare fallback completo - è troppo lento
        // Meglio mostrare errore all'utente
        throw new Error(`Impossibile caricare il gioco. Riprova tra poco.`);
    }
}
// ========== FINE MODIFICA ==========

// Loader per generi
export async function getGenres() {
    const url = `${BASE_URL}/genres`;
    return fetchFromAPI(url, 'genres');
}

// Giochi per genere
export async function getGamesByGenre({ params, request }) {
    const { genre } = params;
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || 1;
    
    const gamesUrl = `${BASE_URL}/games?genres=${genre}&page=${page}&page_size=20`;
    const genreUrl = `${BASE_URL}/genres/${genre}`;
    
    const [gamesData, genreData] = await Promise.all([
        fetchFromAPI(gamesUrl, `genre_${genre}_page_${page}`),
        fetchFromAPI(genreUrl, `genre_details_${genre}`)
    ]);
    
    return { 
        results: gamesData.results, 
        count: gamesData.count,
        genreName: genreData.name 
    };
}

// Loader per ricerca
export async function getGamesBySearch({ request }) {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    if (!query) return { results: [] };
    const apiUrl = `${BASE_URL}/games?search=${query}`;
    return fetchFromAPI(apiUrl, `search_${query}`);
}

export async function getHomepageData() {
    const [popularGames, genres] = await Promise.all([
        getPopularGames(),
        getGenres()
    ]);

    return {
        popularGames: popularGames.results || popularGames,
        genres: genres.results || genres
    };
}

// loader layout
export async function getLayoutData() {
    const url = `${BASE_URL}/games?page=1&page_size=30`;
    return fetchFromAPI(url, 'layout_data');
}