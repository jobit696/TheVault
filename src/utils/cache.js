// Durata cache in millisecondi (es: 1 ora)
const CACHE_DURATION = 60 * 60 * 1000; // 1 ora

export const cache = {
  // Salva dati nella cache
  set: (key, data) => {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    try {
      localStorage.setItem(`rawg_cache_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Cache storage failed:', error);
    }
  },

  // Recupera dati dalla cache
  get: (key) => {
    try {
      const cached = localStorage.getItem(`rawg_cache_${key}`);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      // Controlla se la cache è scaduta
      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem(`rawg_cache_${key}`);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Cache retrieval failed:', error);
      return null;
    }
  },

  // Pulisci tutta la cache RAWG
  clear: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('rawg_cache_')) {
        localStorage.removeItem(key);
      }
    });
  },

  // Pulisci cache scaduta
  clearExpired: () => {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    
    keys.forEach(key => {
      if (key.startsWith('rawg_cache_')) {
        try {
          const cached = localStorage.getItem(key);
          const { timestamp } = JSON.parse(cached);
          
          if (now - timestamp > CACHE_DURATION) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          localStorage.removeItem(key);
        }
      }
    });
  }
};