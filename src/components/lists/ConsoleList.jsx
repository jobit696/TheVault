import { useEffect, useState, useRef } from 'react';
import { Carousel } from 'react-bootstrap';
import ConsoleScene from "../3d_scene/ConsoleScene.jsx";
import styles from "../../css/ConsoleList.module.css";

export default function ConsoleList({title = "- Browse by Platforms -"}) {
  
    const [cardsPerSlide, setCardsPerSlide] = useState(4);
    const [activeIndex, setActiveIndex] = useState(0);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const videoRef = useRef(null);
    const consoles = ['xbox', 'ps5', 'switch', 'pc'];

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

    // Intersection Observer per lazy loading del video
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && videoRef.current) {
                        const video = videoRef.current;
                        if (video.src === '') {
                            video.src = '/videos/video.mp4';
                            video.load();
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    // Raggruppa le console
    const chunkedConsoles = [];
    for (let i = 0; i < consoles.length; i += cardsPerSlide) {
        chunkedConsoles.push(consoles.slice(i, i + cardsPerSlide));
    }

    const showControls = chunkedConsoles.length > 1;

    // Icone personalizzate per le frecce
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
         <>
                <h1 className={styles.pageTitle}>PLATFORMS</h1>
        <div className={`container-fluid ${styles.consoleCarouselWrapper} my-4`}>
            {/* Video Background con Lazy Loading */}
            {!videoLoaded && (
                <div className={styles.videoSkeleton}>
                    <div className={styles.skeletonLoaderVideo}></div>
                </div>
            )}
            <video 
                ref={videoRef}
                autoPlay 
                loop 
                muted 
                playsInline
                className={`${styles.backgroundVideo} ${videoLoaded ? styles.loaded : ''}`}
                onLoadedData={() => setVideoLoaded(true)}
                preload="none"
            >
                <source type="video/mp4" />
            </video>
            
            {/* Overlay */}
            <div className={styles.videoOverlay}></div>
            
            {/* Contenuto */}
            <div className={styles.consoleCarouselContent}>
                <div className={`${styles.gameListTitle} ${styles.parallelogram}`}>
                    {title}
                </div> 
                
                <Carousel 
                    interval={null} 
                    indicators={showControls}
                    controls={showControls}
                    activeIndex={activeIndex}
                    onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
                    prevIcon={prevIcon}
                    nextIcon={nextIcon}
                >
                    {chunkedConsoles.map((consoleGroup, slideIndex) => (
                        <Carousel.Item key={slideIndex}>
                            <div className={`d-flex justify-content-center gap-3 ${styles.carouselCardsContainer} py-4`}>
                                {consoleGroup.map((consoleType) => (
                                    <div 
                                        key={consoleType} 
                                        style={{ flex: '1', maxWidth: `${100 / cardsPerSlide}%` }}
                                    >
                                        <ConsoleScene type={consoleType}/>
                                    </div>
                                ))}
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </div>
        </>
    );
}