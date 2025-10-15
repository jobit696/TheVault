import { memo } from 'react';
import { Link } from 'react-router';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ToggleFavorite from '../ui/ToggleFavorite';
import ToggleFeatured from '../ui/ToggleFeatured';
import styles from '../../css/GenreGameCard.module.css';
import xboxLogo from '../../assets/logos/xboxLogo.svg';
import playstationLogo from '../../assets/logos/playstationLogo.svg';
import switchLogo from '../../assets/logos/switchLogo.svg';
import pcLogo from '../../assets/logos/winLogo.svg';

function GenreGameCard({ game }) { 
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

    return (
        <div className="hasElectricity">
            <Link to={`/games/${game.slug}/${game.id}`} style={{ textDecoration: 'none' }}>
                <div className={styles.genreGameCard}>
                    {/* Bottone Featured per Admin */}
                    <ToggleFeatured 
                        game={game}
                        className={`${styles.featuredButton}`}
                    />

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