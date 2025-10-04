import { memo } from 'react';
import { Link } from 'react-router';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import styles from '../css/CardGame.module.css';

function CardGame({ game }) {
    return (
        <Link to={`/games/${game.slug}/${game.id}`} style={{ textDecoration: 'none' }}>
            <div className={styles.cardGame}>
                <div className={styles.cardGameImageWrapper}>
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
    );
}

export default memo(CardGame);