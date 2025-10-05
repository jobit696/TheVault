import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import GenreImageCard from '../cards/GenreImageCard.jsx';
import styles from '../../css/GenreList.module.css';

export default function GenreList({ genres, games_number = 30, title = "Genres" }) {
    const [cardsPerSlide, setCardsPerSlide] = useState(5);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCardsPerSlide(1); 
            } else if (window.innerWidth < 1200) {
                setCardsPerSlide(2); 
            } else if (window.innerWidth < 1600) {
                setCardsPerSlide(3); 
            } else {
                setCardsPerSlide(4);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // genres dalla prop
    const chunkedGenres = [];
    for (let i = 0; i < genres.length; i += cardsPerSlide) {
        chunkedGenres.push(genres.slice(i, i + cardsPerSlide));
    }

    const prevIcon = (
        <span className={styles.customArrow}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </span>
    );

    const nextIcon = (
        <span className={styles.customArrow}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </span>
    );


    return (
        <div className={`container-fluid ${styles.genreCarouselWrapper} my-4`}>
            <div className={`${styles.genreListTitle} ${styles.parallelogram}`}>
                {title}
            </div>
            <Carousel 
                interval={null} 
                indicators={true}
                controls={true}
                prevIcon={prevIcon}
                nextIcon={nextIcon}
            >
                {chunkedGenres.map((gruppo, slideIndex) => (
                    <Carousel.Item key={slideIndex}>
                        <div className={`d-flex justify-content-center ${styles.carouselCardsContainer} py-4`}>
                            {gruppo.map((genere) => (
                                <div key={genere.id} className={styles.carouselCardItem}>
                                    <GenreImageCard 
                                        url={genere.image_background} 
                                        genre_name={genere.name}
                                        genre_id={genere.id}
                                    />
                                </div>
                            ))}
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
}