import { memo } from 'react';
import { Link } from 'react-router';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ToggleFavorite from '../ui/ToggleFavorite';
import styles from '../../css/InteractiveImageCard.module.css';

function InteractiveImageCard({url, title, number, show_number, gioco}) {
    const primaryGenre = gioco?.genres?.[0]?.name;

    return (
        <Link to={`/games/${gioco.slug}/${gioco.id}`} style={{ textDecoration: 'none' }}>
            <div className={styles.cardFlipContainer}>
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

                <div className={styles.favoriteButton} onClick={(e) => e.preventDefault()}>
                    <ToggleFavorite data={gioco} />
                </div>

                <div className={styles.cardFlipInner}>
                    {/* Fronte */}
                    <div className={`${styles.cardFlipFront} ${styles.customInteractiveImageCard}`}>
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