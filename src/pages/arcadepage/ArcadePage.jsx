// src/pages/ArcadePage.jsx
import { useState } from 'react';
import styles from '../../css/ArcadePage.module.css';
import celeste_thumbnail from '../../assets/pico/celeste_classic.webp'
import celeste2_thumbnail from '../../assets/pico/celeste2.webp'
import soulswap_thumbnail from '../../assets/pico/soulswap.png'
import danktomb_thumbnail from '../../assets/pico/dank_tomb.png'


export default function ArcadePage() {
    const [selectedGame, setSelectedGame] = useState(null);
    
    const games = [
        {
            id: 1,
            title: "Celeste Classic",
            embedUrl: "https://html-classic.itch.zone/html/15163478/index.html",
            thumbnail: celeste_thumbnail,
            description: "Climb the mountain in this challenging platformer"
        },
        {
            id: 2,
            title: "Celeste 2",
            embedUrl: "https://html-classic.itch.zone/html/15163799/index.html",
            thumbnail: celeste2_thumbnail,
            description: "Lani's Trek - The sequel adventure"
        },
        {
            id: 3,
            title: "Soul Swap",
            embedUrl: "https://html-classic.itch.zone/html/4177839/soul_swap_web/index.html",
            thumbnail: soulswap_thumbnail,
            description: "A puzzle platformer with swapping mechanics"
        },
    
     
    ];
    
    return (
        <div className={styles.arcadePage}>
        <div className="container-fluid">
        <h1 className={styles.pageTitle}>Arcade Player</h1>
        <p className={styles.pageSubtitle}>Play retro Pico-8 games</p>
        
        <div className="row">
        <div className="col-12 col-lg-3 order-2 order-lg-1">
        <div className={styles.gamesContainer}>
        <h2 className={styles.gamesContainerTitle}>Games</h2>
        <div className={styles.gamesGrid}>
        {games.map(game => (
            <div 
            key={game.id} 
            className={`${styles.gameCard} ${selectedGame?.id === game.id ? styles.activeGame : ''}`}
            onClick={() => setSelectedGame(game)}
            style={{
                backgroundImage: `url(${game.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
            >
            <div className={styles.gameCardOverlay}>
            <h3 className={styles.gameCardTitle}>{game.title}</h3>
            </div>
            </div>
        ))}
        </div>
        </div>
        </div>
        
        <div className="col-12 col-lg-6 order-1 order-lg-2">
        <div className={styles.playerSection}>
        <div className={styles.gamePlayerCard}>
        {selectedGame ? (
            <iframe
            src={selectedGame.embedUrl}
            className={styles.gameIframe}
            frameBorder="0"
            allowFullScreen
            title={selectedGame.title}
            />
        ) : (
            <div className={styles.placeholderContent}>
            <div className={styles.placeholderIcon}>🎮</div>
            <p>Select a game to play</p>
            </div>
        )}
        </div>
        </div>
        
        </div>
        
        <div className="col-12 col-lg-3 order-3 d-none d-lg-block">
        <div className={styles.instructionContainer}>
        <section className={styles.instructionTitle}>Welcome to the PICO-8 Player!</section>
        <h3>Instructions</h3>
        <ol>
        <li>
        Choose a game from the list on the left
        </li>
        <li>
        Click play on the player in the center of the page
        </li>
        <li>
        Play!
        </li>
        </ol>
        <p className="lead">In the player, at the bottom right, there are several buttons</p>
        <ul>
        <li>Show controls</li>
        <li>Pause</li>
        <li>Toggle sound on/off</li>
        <li>Fullscreen / Windowed mode</li>
        </ul>
        
        </div>
        </div>
        </div>
        </div>
        </div>
    );
}