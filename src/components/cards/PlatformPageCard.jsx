import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ToggleFavorite from '../ui/ToggleFavorite';
import { useAdmin } from '../../context/AdminContext'; 
import { addFeaturedGame, removeFeaturedGame, isFeaturedGame } from '../../services/featuredGamesServices'; 
import styles from '../../css/PlatformPageCard.module.css';

function PlatformPageCard({ game, onFeaturedChange }) { 
    const { isAdmin, showAdminOptions } = useAdmin(); 
    const [isFeatured, setIsFeatured] = useState(false); 
    const [loading, setLoading] = useState(false); 

    const primaryGenre = game?.genres?.[0]?.name;

    // controlla se il gioco è già featured
    useEffect(() => {
        async function checkFeatured() {
            if (game?.id && isAdmin) {
                const featured = await isFeaturedGame(game.id);
                setIsFeatured(featured);
            }
        }
        checkFeatured();
    }, [game?.id, isAdmin]);

    // Toggle featured
    const handleToggleFeatured = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!game) return;
        
        setLoading(true);
        try {
            if (isFeatured) {
                await removeFeaturedGame(game.id);
                setIsFeatured(false);
            } else {
                await addFeaturedGame(game);
                setIsFeatured(true);
            }
            
            // Ricarica la lista se necessario
            if (onFeaturedChange) {
                onFeaturedChange();
            }
        } catch (error) {
            console.error('Errore toggle featured:', error);
            alert('Errore: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Link to={`/games/${game.slug}/${game.id}`} className={styles.gameCard}>
            <div className={styles.cardWrapper}>
                {/* Bottone Featured per Admin */}
                {isAdmin && showAdminOptions && (
                    <button
                        onClick={handleToggleFeatured}
                        disabled={loading}
                        className={`${styles.featuredButton} ${isFeatured ? styles.featuredButtonActive : ''}`}
                        title={isFeatured ? 'Remove from featured' : 'Add to featured'}
                    >
                        {loading ? '⏳' : isFeatured ? '⭐' : '☆'}
                    </button>
                )}

                <div className={styles.favoriteButton} onClick={(e) => e.preventDefault()}>
                    <ToggleFavorite data={game} />
                </div>

                {primaryGenre && (
                    <div className={styles.genreBadge}>
                        {primaryGenre}
                    </div>
                )}

                <LazyLoadImage
                    src={game.background_image}
                    alt={game.name}
                    effect="blur"
                    threshold={400}
                    className={styles.gameImage}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
                    }}
                />
                <div className={styles.gameInfo}>
                    <h5 className={styles.gameTitle}>
                        {game.name}
                    </h5>
                    <div className={styles.gameMetadata}>
                        <span>⭐ {game.rating}</span>
                        {game.released && (
                            <span className="ms-3">
                                {new Date(game.released).getFullYear()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default memo(PlatformPageCard);