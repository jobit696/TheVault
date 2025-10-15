import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useFeaturedGames } from '../../context/FeaturedGamesContext';
import styles from '../../css/FeaturedButton.module.css';

export default function ToggleFeatured({ game, className = "" }) {
    const { isAdmin, showAdminOptions } = useAdmin();
    const { isFeatured: checkIsFeatured, toggleFeatured } = useFeaturedGames();
    const [isFeatured, setIsFeatured] = useState(false);
    const [loading, setLoading] = useState(false);

    // Sincronizza con context
    useEffect(() => {
        if (game?.id) {
            setIsFeatured(checkIsFeatured(game.id));
        }
    }, [game?.id, checkIsFeatured]);

    // Toggle featured
    const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!game || loading) return;
        
        setLoading(true);
        
        try {
            const newState = await toggleFeatured(game, isFeatured);
            setIsFeatured(newState);
            console.log('✅ Toggle completato:', game.name, newState ? 'AGGIUNTO' : 'RIMOSSO');
        } catch (error) {
            console.error('❌ Errore toggle featured:', error);
            alert('Errore: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Non mostrare se non è admin
    if (!isAdmin || !showAdminOptions) {
        return null;
    }

    return (
        <button
            className={`${styles.featuredButton} ${isFeatured ? styles.featuredActive : ''} ${className}`}
            onClick={handleToggle}
            disabled={loading}
            title={isFeatured ? 'Remove from featured' : 'Add to featured'}
        >
            {loading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
            ) : isFeatured ? (
                <i className="fa-solid fa-star"></i>
            ) : (
                <i className="fa-regular fa-star"></i>
            )}
        </button>
    );
}