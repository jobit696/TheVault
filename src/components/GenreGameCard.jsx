import { memo } from 'react';
import { Link } from 'react-router';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ToggleFavorite from './ToggleFavorite';
import styles from '../css/GenreGameCard.module.css';

function GenreGameCard({ game }) {
    return (
        <Link to={`/games/${game.slug}/${game.id}`} style={{ textDecoration: 'none' }}>
            <div className={styles.genreGameCard}>
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
                <div className={styles.gameInfo}>
                    <h3 className={styles.gameTitle}>{game.name}</h3>
                    {game.rating > 0 && (
                        <span className={styles.gameRating}>⭐ {game.rating}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default memo(GenreGameCard);