import { memo } from 'react';
import { Link } from 'react-router';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import styles from '../../css/CardGame.module.css';
import xboxLogo from '../../assets/logos/xboxLogo.svg';
import playstationLogo from '../../assets/logos/playstationLogo.svg';
import switchLogo from '../../assets/logos/switchLogo.svg';
import pcLogo from '../../assets/logos/winLogo.svg';
import { div } from 'three/tsl';

function CardGame({ game }) {
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
        <div className='hasElectricity'>
        <Link to={`/games/${game.slug}/${game.id}`} style={{ textDecoration: 'none' }}>
            <div className={styles.cardGame}>
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
                            {game.genres.map((genre) => (
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