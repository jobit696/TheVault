import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import InteractiveImageCard from '../cards/InteractiveImageCard.jsx';
import styles from '../../css/NewGameList.module.css';

export default function NewGameList({ games, title = 'New Releases' }) {
    const [cardsPerSlide, setCardsPerSlide] = useState(5);
    
    // Prende SOLO dalle props (passate dal loader)
    const giochi = games?.results || games || [];

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

    // Se non ci sono giochi, non mostrare nulla
    if (!giochi || giochi.length === 0) {
        return null;
    }

    const chunkedGames = [];
    for (let i = 0; i < giochi.length; i += cardsPerSlide) {
        chunkedGames.push(giochi.slice(i, i + cardsPerSlide));
    }

    const prevIcon = (
        <span className={`${styles.customArrow} hasElectricity`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </span>
    );

    const nextIcon = (
        <span className={`${styles.customArrow} hasElectricity`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </span>
    );

    return (
        <>
            <h1 className={styles.pageTitle}>HOT NEW RELEASES</h1>
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