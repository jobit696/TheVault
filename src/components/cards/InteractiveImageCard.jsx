import { memo } from 'react';
import { Link } from 'react-router';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ToggleFavorite from '../ui/ToggleFavorite';
import ToggleFeatured from '../ui/ToggleFeatured';
import styles from '../../css/InteractiveImageCard.module.css';
import xboxLogo from '../../assets/logos/xboxLogo.svg';
import playstationLogo from '../../assets/logos/playstationLogo.svg';
import switchLogo from '../../assets/logos/switchLogo.svg';
import pcLogo from '../../assets/logos/winLogo.svg';

function InteractiveImageCard({ 
    url, 
    title, 
    number, 
    show_number, 
    gioco,
    
}) {
    const primaryGenre = gioco?.genres?.[0]?.name;
    
    // Funzione per verificare se una piattaforma è disponibile
    const hasPlatform = (platformName) => {
        return gioco?.parent_platforms?.some(p => 
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

    const handleFeaturedToggle = (gameId, newFeaturedState) => {
        console.log('🎮 InteractiveImageCard - handleFeaturedToggle chiamato:', {
            gameId,
            newFeaturedState,
            hasOnFeaturedChange: !!onFeaturedChange
        });
        
        // Chiama la callback SOLO se esiste
        if (onFeaturedChange) {
            onFeaturedChange(gameId, newFeaturedState);
        }
        // Se non c'è la callback, va bene lo stesso!
        // Il componente ToggleFeatured gestisce già il suo stato interno
    };

    return (
        <Link to={`/games/${gioco.slug}/${gioco.id}`} style={{ textDecoration: 'none' }}>
            <div className={`${styles.cardFlipContainer} hasElectricity`}>
                {show_number && (
                    <div className={styles.gameNumber}>
                        {number}<span className={styles.degreeSymbol}>°</span>
                    </div>
                )}
                
                {primaryGenre && (
                    <div className={styles.genreBadge}>
                        {primaryGenre}
                    </div>
                )}

                {/* Bottone Featured per Admin */}
                <ToggleFeatured 
                    game={gioco}
                    className={`${styles.featuredButton}`}
                />

                <div className={styles.favoriteButton} onClick={(e) => e.preventDefault()}>
                    <ToggleFavorite data={gioco} />
                </div>

                <div className={styles.cardFlipInner}>
                    {/* Fronte */}
                    <div className={`${styles.cardFlipFront} ${styles.customInteractiveImageCard}`}>
                        <div className={`${styles.cardPlatformContainer}`}>
                            {platforms.xbox && (
                                <div className={`${styles.cardPlatformItem}`}>
                                    <img className={`${styles.cardPlatformItemImg}`} src={xboxLogo} alt="Xbox" />
                                </div>
                            )}
                            {platforms.playstation && (
                                <div className={`${styles.cardPlatformItem}`}>
                                    <img className={`${styles.cardPlatformItemImg}`} src={playstationLogo} alt="PlayStation" />
                                </div>
                            )}
                            {platforms.nintendo && (
                                <div className={`${styles.cardPlatformItem}`}>
                                    <img className={`${styles.cardPlatformItemImg}`} src={switchLogo} alt="Switch" />
                                </div>
                            )}
                            {platforms.pc && (
                                <div className={`${styles.cardPlatformItem}`}>
                                    <img className={`${styles.cardPlatformItemImg}`} src={pcLogo} alt="PC" />
                                </div>
                            )}
                        </div>
                        <LazyLoadImage
                            src={url}
                            alt={title}
                            className={styles.interactiveCardImg}
                            effect="blur"
                            threshold={400}
                            wrapperProps={{
                                style: {
                                    width: '100%',
                                    height: '100%',
                                    display: 'block'
                                }
                            }}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                            }}
                        />
                    </div>
                    {/* Retro */}
                    <div className={`${styles.cardFlipBack} ${styles.customInteractiveImageCard}`}>
                        <div className={styles.cardBackContent}>
                            <h5>{title}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default memo(InteractiveImageCard);