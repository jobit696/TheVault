import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ToggleFavorite from '../ui/ToggleFavorite';
import { useAdmin } from '../../context/AdminContext'; 
import { addFeaturedGame, removeFeaturedGame, isFeaturedGame } from '../../services/featuredGamesServices'; 
import styles from '../../css/GenreGameCard.module.css';
import xboxLogo from '../../assets/logos/xboxLogo.svg';
import playstationLogo from '../../assets/logos/playstationLogo.svg';
import switchLogo from '../../assets/logos/switchLogo.svg';
import pcLogo from '../../assets/logos/winLogo.svg';

function GenreGameCard({ game, onFeaturedChange }) { 
    const { isAdmin, showAdminOptions } = useAdmin(); 
    const [isFeatured, setIsFeatured] = useState(false); 
    const [loading, setLoading] = useState(false); 

    // Funzione per verificare se una piattaforma è disponibile
    const hasPlatform = (platformName) => {
        return game?.parent_platforms?.some(p => 
            p.platform.slug.includes(platformName)
        ) || false;
    };

    // Mappa delle piattaforme disponibili
    const platforms = {
        xbox: hasPlatform('xbox'),
        playstation: hasPlatform('playstation'),
        nintendo: hasPlatform('nintendo'),
        pc: hasPlatform('pc')
    };

    // Controlla se il gioco è già featured
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
        <div className="hasElectricity">
            <Link to={`/games/${game.slug}/${game.id}`} style={{ textDecoration: 'none' }}>
                <div className={styles.genreGameCard}>
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

                    <LazyLoadImage
                        src={game.background_image}
                        alt={game.name}
                        effect="blur"
                        threshold={400}
                        className={styles.gameImage}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                    />

                    {/* Container piattaforme */}
                    <div className={styles.cardPlatformContainer}>
                        {platforms.xbox && (
                            <div className={styles.cardPlatformItem}>
                                <img className={styles.cardPlatformItemImg} src={xboxLogo} alt="Xbox" />
                            </div>
                        )}
                        {platforms.playstation && (
                            <div className={styles.cardPlatformItem}>
                                <img className={styles.cardPlatformItemImg} src={playstationLogo} alt="PlayStation" />
                            </div>
                        )}
                        {platforms.nintendo && (
                            <div className={styles.cardPlatformItem}>
                                <img className={styles.cardPlatformItemImg} src={switchLogo} alt="Switch" />
                            </div>
                        )}
                        {platforms.pc && (
                            <div className={styles.cardPlatformItem}>
                                <img className={styles.cardPlatformItemImg} src={pcLogo} alt="PC" />
                            </div>
                        )}
                    </div>

                    <div className={styles.gameInfo}>
                        <h3 className={styles.gameTitle}>{game.name}</h3>
                        {game.rating > 0 && (
                            <span className={styles.gameRating}>⭐ {game.rating}</span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default memo(GenreGameCard);