import { memo } from 'react';
import { Link } from 'react-router';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ToggleFavorite from '../ui/ToggleFavorite';
import ToggleFeatured from '../ui/ToggleFeatured';
import styles from '../../css/PlatformPageCard.module.css';

function PlatformPageCard({ game }) { 
    const primaryGenre = game?.genres?.[0]?.name;

    return (
        <Link to={`/games/${game.slug}/${game.id}`} className={styles.gameCard}>
            <div className={styles.cardWrapper}>
                {/* Bottone Featured per Admin */}
                <ToggleFeatured 
                    game={game}
                    className={`${styles.featuredButton}`}
                />

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