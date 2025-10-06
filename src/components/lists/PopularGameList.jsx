import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useGetGiochiPopolari } from '../../functions/gameFunctions.js';
import InteractiveImageCard from '../cards/InteractiveImageCard.jsx';
import styles from '../../css/PopularGameList.module.css';

export default function PopularGameList({ games, title = 'senza titolo' }) {
    const [cardsPerSlide, setCardsPerSlide] = useState(5);
    
    // Se non riceve games come prop
    const hookData = useGetGiochiPopolari(10);
    
    // altrimenti >> hook
    const giochi = games?.results || games || hookData.giochi;
    const loading = games ? false : hookData.loading;
    const error = games ? null : hookData.error;

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

    const chunkedGames = [];
    for (let i = 0; i < giochi.length; i += cardsPerSlide) {
        chunkedGames.push(giochi.slice(i, i + cardsPerSlide));
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

    return (
        <>
        <h1 className={styles.pageTitle}>POPULAR GAMES</h1>
        <div className={`container-fluid ${styles.popularGamesCarouselWrapper} mt-4`}>
            <div className={`${styles.gameListTitle} ${styles.parallelogram}`}>
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
                        <div className={`d-flex justify-content-center ${styles.carouselCardsContainer} py-4 my-4`}>
                            {gruppo.map((gioco, index) => (
                                <div key={gioco.id} className={styles.carouselCardItem}>
                                    <InteractiveImageCard 
                                        url={gioco.background_image} 
                                        title={gioco.name}
                                        number={Math.floor((slideIndex * cardsPerSlide + index) / giochi.length * 10) + 1}
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
        </>
    );
}