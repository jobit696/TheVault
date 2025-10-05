import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import InteractiveImageCard from '../cards/InteractiveImageCard.jsx';
import styles from '../../css/PopularGameList.module.css';

export default function CustomGameList({ title = 'Featured Games', gameIds = [] }) {
    const [cardsPerSlide, setCardsPerSlide] = useState(5);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_KEY = import.meta.env.VITE_RAW_G_KEY;
    const BASE_URL = import.meta.env.VITE_RAW_G_URL;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600) {
                setCardsPerSlide(1); 
            } else if (window.innerWidth < 768) {
                setCardsPerSlide(2); 
            } else if (window.innerWidth < 1200) {
                setCardsPerSlide(3); 
            } else {
                setCardsPerSlide(5);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchGames = async () => {
            if (gameIds.length === 0) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const promises = gameIds.map(id => 
                    fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`)
                        .then(res => res.json())
                );
                
                const results = await Promise.all(promises);
                setGames(results);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [gameIds]);

    const chunkedGames = [];
    for (let i = 0; i < games.length; i += cardsPerSlide) {
        chunkedGames.push(games.slice(i, i + cardsPerSlide));
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

    if (loading) {
        return (
            <div className={`container-fluid ${styles.popularGamesCarouselWrapper} ${styles.loaderContainer} my-4 d-flex justify-content-center align-items-center`}>
                <div className="page-loader">
                    <div className="loader-spinner-large"></div>
                    <p className="loader-text">Loading Games...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className={`container-fluid ${styles.popularGamesCarouselWrapper} my-4`}>
                <h2>Error: {error}</h2>
            </div>
        );
    }

    if (games.length === 0) {
        return null;
    }

    return (
        <div className={`container-fluid ${styles.popularGamesCarouselWrapper} my-4`}>
            <div className={`${styles.gameListTitle2} ${styles.parallelogram}`}>
                {title}
            </div>
            <Carousel 
                interval={null} 
                indicators={true}
                controls={true}
                prevIcon={prevIcon}
                nextIcon={nextIcon}
            >
                {chunkedGames.map((gruppo, slideIndex) => (
                    <Carousel.Item key={slideIndex}>
                        <div className={`d-flex justify-content-center ${styles.carouselCardsContainer} py-4`}>
                            {gruppo.map((gioco, index) => (
                                <div key={gioco.id} className={styles.carouselCardItem}>
                                    <InteractiveImageCard 
                                        url={gioco.background_image} 
                                        title={gioco.name}
                                        number={slideIndex * cardsPerSlide + index + 1}
                                        show_number={true}
                                        gioco={gioco}
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