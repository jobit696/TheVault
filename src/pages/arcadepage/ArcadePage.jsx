import { useState } from 'react';
import styles from '../../css/ArcadePage.module.css';
import celeste_thumbnail from '../../assets/pico/celeste_classic.webp'
import celeste2_thumbnail from '../../assets/pico/celeste2.webp'
import soulswap_thumbnail from '../../assets/pico/soulswap.png'

export default function ArcadePage() {
    const [selectedGame, setSelectedGame] = useState(null);
    
    const games = [
        {
            id: 1,
            title: "Celeste Classic",
            embedUrl: "https://html-classic.itch.zone/html/15163478/index.html",
            thumbnail: celeste_thumbnail,
            description: "Climb the mountain in this challenging platformer",
            difficulty: "Hard"
        },
        {
            id: 2,
            title: "Celeste 2",
            embedUrl: "https://html-classic.itch.zone/html/15163799/index.html",
            thumbnail: celeste2_thumbnail,
            description: "Lani's Trek - The sequel adventure",
            difficulty: "Medium"
        },
        {
            id: 3,
            title: "Soul Swap",
            embedUrl: "https://html-classic.itch.zone/html/4177839/soul_swap_web/index.html",
            thumbnail: soulswap_thumbnail,
            description: "A puzzle platformer with swapping mechanics",
            difficulty: "Medium"
        },
    ];
    
    return (
        <div className={styles.arcadePage}>
             <div className={styles.headerSection}>
                    <h1 className={styles.pageTitle}>PICO-8 PLAYER</h1>
                    <p className={styles.pageSubtitle}>Play retro Pico-8 games directly in your browser</p>
                </div>
            <div className="container">
               
                
                <div className="row g-4">
                    {/* Colonna sinistra - Lista giochi */}
                    <div className="col-12 col-lg-3 order-2 order-lg-1">
                        <div className={styles.gamesContainer}>
                            <h2 className={styles.gamesContainerTitle}>Available Games</h2>
                            <div className={styles.gamesGrid}>
                                {games.map(game => (
                                    <div 
                                        key={game.id} 
                                        className={`${styles.gameCard} ${selectedGame?.id === game.id ? styles.activeGame : ''} hasElectricity`}
                                        onClick={() => setSelectedGame(game)}
                                    >
                                        <img 
                                            src={game.thumbnail} 
                                            alt={game.title}
                                            className={styles.gameCardImage}
                                        />
                                        <div className={styles.gameCardOverlay}>
                                            <h3 className={styles.gameCardTitle}>{game.title}</h3>
                                            <span className={styles.gameDifficulty}>{game.difficulty}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {selectedGame && (
                                <div className={styles.gameInfo}>
                                    <h3 className={styles.gameInfoTitle}>{selectedGame.title}</h3>
                                    <p className={styles.gameInfoDescription}>{selectedGame.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Colonna centrale - Player */}
                    <div className="col-12 col-lg-6 order-1 order-lg-2">
                        <div className={styles.playerSection}>
                            <div className={styles.gamePlayerCard}>
                                {selectedGame ? (
                                    <>
                                        <div className={styles.playerHeader}>
                                            <span className={styles.nowPlaying}>Now Playing: {selectedGame.title}</span>
                                            <button 
                                                className={styles.closeButton}
                                                onClick={() => setSelectedGame(null)}
                                                aria-label="Close game"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <iframe
                                            src={selectedGame.embedUrl}
                                            className={styles.gameIframe}
                                            frameBorder="0"
                                            allowFullScreen
                                            title={selectedGame.title}
                                        />
                                    </>
                                ) : (
                                    <div className={styles.placeholderContent}>
                                        <div className={styles.placeholderIcon}>🎮</div>
                                        <p className={styles.placeholderTitle}>Select a game to start playing</p>
                                        <p className={styles.placeholderSubtitle}>Choose from the games on the left</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Colonna destra - Istruzioni */}
                    <div className="col-12 col-lg-3 order-3">
                        <div className={styles.instructionContainer}>
                            <div className={styles.instructionTitle}>How to Play</div>
                            <div className={styles.instructionContent}>
                                <section className={styles.instructionSection}>
                                    <h3>Getting Started</h3>
                                    <ol>
                                        <li>Select a game from the list</li>
                                        <li>Wait for the game to load</li>
                                        <li>Click the play button in the player</li>
                                        <li>Enjoy your game!</li>
                                    </ol>
                                </section>
                                
                                <section className={styles.instructionSection}>
                                    <h3>Player Controls</h3>
                                    <ul>
                                        <li><strong>Show controls:</strong> View game keyboard mappings</li>
                                        <li><strong>Pause:</strong> Pause/resume gameplay</li>
                                        <li><strong>Sound:</strong> Toggle audio on/off</li>
                                        <li><strong>Fullscreen:</strong> Play in fullscreen mode</li>
                                    </ul>
                                </section>
                                
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}