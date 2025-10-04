import { memo } from 'react';
import { Link } from 'react-router';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import styles from '../css/GenreImageCard.module.css';

function GenreImageCard({url, genre_name, genre_id}) {
    // Crea slug 
    const genreSlug = genre_name.toLowerCase().replace(/\s+/g, '-');
    
    return (
        <Link to={`/genre/${genre_id}`} style={{ textDecoration: 'none' }}>
            <div className={`card ${styles.customGenreCard}`}>
                <LazyLoadImage
                    src={url}
                    alt={genre_name}
                    className={styles.cardImgGenre}
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
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                />
                <p className={styles.genreLabel}>{genre_name}</p>
            </div>
        </Link>
    );
}

export default memo(GenreImageCard);