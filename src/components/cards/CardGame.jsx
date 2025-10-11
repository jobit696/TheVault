import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useAdmin } from '../../context/AdminContext'; 
import { addFeaturedGame, removeFeaturedGame, isFeaturedGame } from '../../services/featuredGamesServices'; 
import styles from '../../css/CardGame.module.css';
import xboxLogo from '../../assets/logos/xboxLogo.svg';
import playstationLogo from '../../assets/logos/playstationLogo.svg';
import switchLogo from '../../assets/logos/switchLogo.svg';
import pcLogo from '../../assets/logos/winLogo.svg';

function CardGame({ game, onFeaturedChange }) { 
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
        <div className='hasElectricity'>
            <Link to={`/games/${game.slug}/${game.id}`} style={{ textDecoration: 'none' }}>
                <div className={styles.cardGame}>
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

                    <div className={styles.cardGameImageWrapper}>
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

                        <LazyLoadImage
                            src={game.background_image}
                            alt={game.name}
                            className={styles.cardGameImage}
                            effect="blur"
                            threshold={100}
                            wrapperProps={{
                                style: {
                                    width: '100%',
                                    height: '100%',
                                    display: 'block'
                                }
                            }}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                            }}
                        />
                    </div>
                    <div className={styles.cardGameContent}>
                        <h3 className={styles.cardGameTitle}>{game.name}</h3>
                        <div className={styles.cardGameInfo}>
                            <span className={styles.cardGameRating}>⭐ {game.rating}</span>
                            <span className={styles.cardGameReleased}>{game.released}</span>
                        </div>
                        {game.genres && game.genres.length > 0 && (
                            <div className={styles.cardGameGenres}>
                                {game.genres.slice(0, 3).map((genre) => (
                                    <span key={genre.id} className={styles.genreTag}>
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default memo(CardGame);