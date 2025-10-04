import useFetchSolution from '../components/hook/useFetchSolution'; // Importa il custom hook

const API_KEY = import.meta.env.VITE_RAW_G_KEY;
const BASE_URL = import.meta.env.VITE_RAW_G_URL;

// Hook per cercare giochi
export function useCercaGiochi(query) {
    const url = query ? `${BASE_URL}/games?key=${API_KEY}&search=${query}` : null;
    const { data, loading, error } = useFetchSolution(url);
    return { giochi: data?.results || [], loading, error };
}

// Hook per ottenere tutti i giochi
export function useGetTuttiGiochi(page = 1, pageSize = 20) {
    const url = `${BASE_URL}/games?key=${API_KEY}&page=${page}&page_size=${pageSize}`;
    return useFetchSolution(url);
}

// Hook per giochi popolari
export function useGetGiochiPopolari(pageSize = 10) {
    const url = `${BASE_URL}/games?key=${API_KEY}&ordering=-rating&page_size=${pageSize}`;
    const { data, loading, error } = useFetchSolution(url);
    return { giochi: data?.results || [], loading, error };
}

// Hook per giochi recenti
export function useGetGiochiRecenti(page = 1) {
    const url = `${BASE_URL}/games?key=${API_KEY}&ordering=-released&page=${page}`;
    const { data, loading, error } = useFetchSolution(url);
    return { giochi: data?.results || [], loading, error };
}

// Hook per dettagli gioco
export function useDettagliGioco(gameId) {
    const url = gameId ? `${BASE_URL}/games/${gameId}?key=${API_KEY}` : null;
    return useFetchSolution(url);
}

// Hook per screenshots
export function useGetScreenshots(gameId) {
    const url = gameId ? `${BASE_URL}/games/${gameId}/screenshots?key=${API_KEY}` : null;
    const { data, loading, error } = useFetchSolution(url);
    return { screenshots: data?.results || [], loading, error };
}

// Hook per generi
export function useGetGeneri() {
    const url = `${BASE_URL}/genres?key=${API_KEY}`;
    const { data, loading, error } = useFetchSolution(url);
    return { generi: data?.results || [], loading, error };
}

// Hook per giochi per genere
export function useGetGiochiPerGenere(genreId, page = 1) {
    const url = genreId ? `${BASE_URL}/games?key=${API_KEY}&genres=${genreId}&page=${page}` : null;
    const { data, loading, error } = useFetchSolution(url);
    return { giochi: data?.results || [], loading, error };
}

// Hook per piattaforme
export function useGetPiattaforme() {
    const url = `${BASE_URL}/platforms?key=${API_KEY}`;
    const { data, loading, error } = useFetchSolution(url);
    return { piattaforme: data?.results || [], loading, error };
}

// Hook per giochi per piattaforma
export function useGetGiochiPerPiattaforma(platformId, page = 1) {
    const url = platformId ? `${BASE_URL}/games?key=${API_KEY}&platforms=${platformId}&page=${page}` : null;
    const { data, loading, error } = useFetchSolution(url);
    return { giochi: data?.results || [], loading, error };
}

// Hook per video gioco
export function useGetVideoGioco(gameId) {
    const url = gameId ? `${BASE_URL}/games/${gameId}/movies?key=${API_KEY}` : null;
    const { data, loading, error } = useFetchSolution(url);
    return { videos: data?.results || [], loading, error };
}

export function useGetScreenshotsGioco(gameId) {
    const url = gameId ? `${BASE_URL}/games/${gameId}/screenshots?key=${API_KEY}` : null;
    const { data, loading, error } = useFetchSolution(url);
    return { screenshots: data?.results || [], loading, error };
}

// Hook per filtrare giochi
export function useFiltraGiochi(filtriIniziali = {}) {
    const buildUrl = (filtri) => {
        const { 
            search = '', 
            genres = '', 
            platforms = '', 
            ordering = '-rating',
            page = 1,
            pageSize = 20 
        } = filtri;
        
        let url = `${BASE_URL}/games?key=${API_KEY}&page=${page}&page_size=${pageSize}&ordering=${ordering}`;
        
        if (search) url += `&search=${search}`;
        if (genres) url += `&genres=${genres}`;
        if (platforms) url += `&platforms=${platforms}`;
        
        return url;
    };

    const { data, loading, error, updateUrl } = useFetchSolution(buildUrl(filtriIniziali));
    
    const aggiorna = (nuoviFiltri) => {
        updateUrl(buildUrl(nuoviFiltri));
    };

    return { 
        giochi: data?.results || [], 
        totalCount: data?.count || 0,
        loading, 
        error,
        aggiorna
    };
}