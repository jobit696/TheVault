import { useState, useEffect } from 'react';
import styles from '../css/UpcomingGamesCarousel.module.css';

export default function UpcomingGamesCarousel({ customGames = [] }) {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const API_KEY = import.meta.env.VITE_RAW_G_KEY;
const BASE_URL = import.meta.env.VITE_RAW_G_URL;

    useEffect(() => {
        const fetchGames = async () => {
            if (customGames.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const promises = customGames.map(async ({ id, releaseDate }) => {
                    const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
                    const gameData = await response.json();
                    return { ...gameData, customReleaseDate: releaseDate };
                });

                const results = await Promise.all(promises);
                setGames(results);
            } catch (error) {
                console.error('Error fetching games:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [customGames]);

    // Auto-play carousel
    useEffect(() => {
        if (games.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [games.length]);

    const Countdown = ({ releaseDate }) => {
        const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

        useEffect(() => {
            const calculateTimeLeft = () => {
                const difference = new Date(releaseDate) - new Date();
                
                if (difference > 0) {
                    setTimeLeft({
                        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                        minutes: Math.floor((difference / 1000 / 60) % 60),
                        seconds: Math.floor((difference / 1000) % 60)
                    });
                } else {
                    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                }
            };

            calculateTimeLeft();
            const timer = setInterval(calculateTimeLeft, 1000);

            return () => clearInterval(timer);
        }, [releaseDate]);

        return (
            <div className={styles.countdown}>
                <div className={styles.countdownItem}>
                    <span className={styles.countdownNumber}>{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className={styles.countdownLabel}>Days</span>
                </div>
                <div className={styles.countdownItem}>
                    <span className={styles.countdownNumber}>{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className={styles.countdownLabel}>Hours</span>
                </div>
                <div className={styles.countdownItem}>
                    <span className={styles.countdownNumber}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className={styles.countdownLabel}>Min</span>
                </div>
                <div className={styles.countdownItem}>
                    <span className={styles.countdownNumber}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className={styles.countdownLabel}>Sec</span>
                </div>
            </div>
        );
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + games.length) % games.length);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
    };

    if (loading) {
        return (
            <div className={styles.upcomingCarouselWrapper}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div className={styles.spinner}></div>
                        <p style={{ color: 'white' }}>Loading Upcoming Games...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (games.length === 0) return null;

    const currentGame = games[currentIndex];

    return (
        <div style={{ width: '100%', marginTop: '4rem' }}>
          
            <div className={styles.upcomingCarouselWrapper}>
                <div className={styles.carouselSlide}>
                    <img
                        src={currentGame.background_image || 'https://via.placeholder.com/1920x500'}
                        alt={currentGame.name}
                        className={styles.slideImage}
                    />
                    <div className={styles.slideOverlay}>
                        <div className={styles.slideContent}>
                            <span className={styles.comingSoonBadge}>Coming Soon</span>
                            
                            <h2 className={styles.gameTitle}>{currentGame.name}</h2>
                            
                            {currentGame.customReleaseDate && (
                                <>
                                    <p className={styles.releaseDate}>
                                        Release Date: {new Date(currentGame.customReleaseDate).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                    <Countdown releaseDate={currentGame.customReleaseDate} />
                                </>
                            )}

                            {currentGame.genres && currentGame.genres.length > 0 && (
                                <div className={styles.genres}>
                                    {currentGame.genres.slice(0, 3).map((genre) => (
                                        <span key={genre.id} className={styles.genreTag}>
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button className={`${styles.carouselControl} ${styles.prev}`} onClick={goToPrevious}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <button className={`${styles.carouselControl} ${styles.next}`} onClick={goToNext}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>

                {/* Indicators */}
                <div className={styles.carouselIndicators}>
                    {games.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}