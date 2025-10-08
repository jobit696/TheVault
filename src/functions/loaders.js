const API_KEY = import.meta.env.VITE_RAW_G_KEY;
const BASE_URL = import.meta.env.VITE_RAW_G_URL;

// Helper function per fetch
async function fetchFromAPI(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// Giochi popolari (ultimi 30 giorni)
export async function getPopularGames() {
    const today = new Date();
    const past30Days = new Date();
    past30Days.setDate(today.getDate() - 30);
    const formatDate = (date) => date.toISOString().split('T')[0];
    const startDate = formatDate(past30Days);
    const endDate = formatDate(today);
    const url = `${BASE_URL}/games?key=${API_KEY}&dates=${startDate},${endDate}&ordering=-released,-rating&page_size=10`;
    return fetchFromAPI(url);
}


// Tutti i giochi 
export async function getAllGames({ request }) {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || 1;
    const apiUrl = `${BASE_URL}/games?key=${API_KEY}&page=${page}&page_size=20`;
    return fetchFromAPI(apiUrl);
}

// Giochi per piattaforma
export async function getGamesByPlatform({ params, request }) {
    const { platformId } = params;
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || 1;
    const apiUrl = `${BASE_URL}/games?key=${API_KEY}&platforms=${platformId}&page=${page}&page_size=20`;
    return fetchFromAPI(apiUrl);
}

export async function getGameDetails({ params }) {
    const { id } = params;
    const gameUrl = `${BASE_URL}/games/${id}?key=${API_KEY}`;
    const screenshotsUrl = `${BASE_URL}/games/${id}/screenshots?key=${API_KEY}`;
    const dlcUrl = `${BASE_URL}/games/${id}/additions?key=${API_KEY}`;
    const similarUrl = `${BASE_URL}/games/${id}/game-series?key=${API_KEY}`;
    
    const safeFetch = async (url) => {
        try {
            return await fetchFromAPI(url);
        } catch (error) {
            console.warn(`Failed to fetch ${url}:`, error);
            return { results: [] };
        }
    };
    
    const [game, screenshots, dlcs, similarGames] = await Promise.all([
        fetchFromAPI(gameUrl),
        fetchFromAPI(screenshotsUrl),
        safeFetch(dlcUrl),
        safeFetch(similarUrl)
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
    const url = `${BASE_URL}/genres?key=${API_KEY}`;
    return fetchFromAPI(url);
}

// Giochi per genere
export async function getGamesByGenre({ params, request }) {
    const { genre } = params; // Questo è l'ID del genere
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || 1;
    
    // Giochi e dettagli del genere
    const gamesUrl = `${BASE_URL}/games?key=${API_KEY}&genres=${genre}&page=${page}&page_size=20`;
    const genreUrl = `${BASE_URL}/genres/${genre}?key=${API_KEY}`;
    
    const [gamesData, genreData] = await Promise.all([
        fetchFromAPI(gamesUrl),
        fetchFromAPI(genreUrl)
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
    const apiUrl = `${BASE_URL}/games?key=${API_KEY}&search=${query}`;
    return fetchFromAPI(apiUrl);
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
    const url = `${BASE_URL}/games?key=${API_KEY}&page=1&page_size=30`;
    return fetchFromAPI(url);
}