import { cache } from '../utils/cache';
import { getCurrentRawgApiKey, rotateRawgApiKey, getTotalRawgKeys } from '../utils/apiKeyRotation';

const BASE_URL = import.meta.env.VITE_RAW_G_URL;

// Helper function per fetch CON CACHE e ROTAZIONE KEY
async function fetchFromAPI(url, cacheKey, retries = 0) {
    const maxRetries = getTotalRawgKeys(); // Prova tutte le key RAWG disponibili

    // Prova a recuperare dalla cache
    const cached = cache.get(cacheKey);
    if (cached) {
        return cached;
    }

    // Costruisci URL con la chiave corrente
    const API_KEY = getCurrentRawgApiKey();
    const urlWithKey = url.includes('?') 
        ? `${url}&key=${API_KEY}` 
        : `${url}?key=${API_KEY}`;

   

    try {
        const response = await fetch(urlWithKey);
        
        // Se errore 429 o 403 (quota esaurita), prova la chiave successiva
        if ((response.status === 429 || response.status === 403) && retries < maxRetries - 1) {
            console.warn(`⚠️ RAWG Key #${retries + 1} esaurita, provo la successiva...`);
            rotateRawgApiKey();
            return fetchFromAPI(url, cacheKey, retries + 1);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Salva nella cache
        cache.set(cacheKey, data);
        
        return data;
    } catch (error) {
        // Se errore di rete e ci sono altre chiavi, prova la successiva
        if (retries < maxRetries - 1) {
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

export async function getGameDetails({ params }) {
    const { id } = params;
    const gameUrl = `${BASE_URL}/games/${id}`;
    const screenshotsUrl = `${BASE_URL}/games/${id}/screenshots`;
    const dlcUrl = `${BASE_URL}/games/${id}/additions`;
    const similarUrl = `${BASE_URL}/games/${id}/game-series`;
    
    const safeFetch = async (url, cacheKey) => {
        try {
            return await fetchFromAPI(url, cacheKey);
        } catch (error) {
            console.warn(`Failed to fetch ${url}:`, error);
            return { results: [] };
        }
    };
    
    const [game, screenshots, dlcs, similarGames] = await Promise.all([
        fetchFromAPI(gameUrl, `game_${id}`),
        fetchFromAPI(screenshotsUrl, `screenshots_${id}`),
        safeFetch(dlcUrl, `dlc_${id}`),
        safeFetch(similarUrl, `similar_${id}`)
    ]);
    
    return { 
        game, 
        screenshots: screenshots.results || [], 
        dlcs: dlcs.results || [],
        similarGames: similarGames.results || []
    };
}

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