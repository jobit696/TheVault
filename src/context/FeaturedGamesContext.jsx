import { createContext, useContext, useState, useCallback } from 'react';
import { getFeaturedGames, addFeaturedGame, removeFeaturedGame } from '../services/featuredGamesServices';

const FeaturedGamesContext = createContext();

export function FeaturedGamesProvider({ children }) {
    const [featuredGamesIds, setFeaturedGamesIds] = useState(new Set());
    const [listeners, setListeners] = useState([]);

    // Carica gli ID dei featured games
    const loadFeaturedIds = useCallback(async () => {
        const games = await getFeaturedGames();
        const ids = new Set(games.map(g => g.game_id));
        setFeaturedGamesIds(ids);
        return ids;
    }, []);

    // Aggiungi un listener per i cambiamenti
    const addListener = useCallback((callback) => {
        setListeners(prev => [...prev, callback]);
        return () => {
            setListeners(prev => prev.filter(cb => cb !== callback));
        };
    }, []);

    // Notifica tutti i listener
    const notifyListeners = useCallback((gameId, isFeatured) => {
        listeners.forEach(callback => callback(gameId, isFeatured));
    }, [listeners]);

    // Toggle featured con notifica globale
    const toggleFeatured = useCallback(async (game, currentState) => {
        try {
            if (currentState) {
                // Rimuovi
                await removeFeaturedGame(game.id);
                setFeaturedGamesIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(game.id);
                    return newSet;
                });
                notifyListeners(game.id, false);
                return false;
            } else {
                // Aggiungi
                await addFeaturedGame(game);
                setFeaturedGamesIds(prev => new Set(prev).add(game.id));
                notifyListeners(game.id, true);
                return true;
            }
        } catch (error) {
            console.error('Errore toggle featured:', error);
            throw error;
        }
    }, [notifyListeners]);

    // Controlla se un gioco è featured
    const isFeatured = useCallback((gameId) => {
        return featuredGamesIds.has(gameId);
    }, [featuredGamesIds]);

    return (
        <FeaturedGamesContext.Provider value={{
            featuredGamesIds,
            loadFeaturedIds,
            toggleFeatured,
            isFeatured,
            addListener
        }}>
            {children}
        </FeaturedGamesContext.Provider>
    );
}

export function useFeaturedGames() {
    const context = useContext(FeaturedGamesContext);
    if (!context) {
        throw new Error('useFeaturedGames deve essere usato dentro FeaturedGamesProvider');
    }
    return context;
}