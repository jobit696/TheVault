import { useState } from 'react';
import styles from '../../css/CommunityGamePage.module.css';

export default function CommunityGamePage() {
    const [showPlayer, setShowPlayer] = useState(false);
    
    const game = {
        title: "The Hole", 
        developer: {
            name: "JoBit91",
            avatar: "https://via.placeholder.com/80?text=JB",
            joinDate: "Member since xxxx"
        },
        cover: "https://img.itch.zone/aW1nLzE1MTM4Njc4LnBuZw==/315x250%23c/S%2BecH5.png",
        screenshots: [
            "https://img.itch.zone/aW1nLzE1MTU4ODAzLnBuZw==/original/KwX020.png", 
            "https://img.itch.zone/aW1nLzE1MTM4Njc4LnBuZw==/315x250%23c/S%2BecH5.png",
            "https://img.itch.zone/aW1hZ2UvMjU0Mjg2MC8xNTE0NDE5My5wbmc=/250x600/ajFeRO.png",
            "https://img.itch.zone/aW1hZ2UvMjU0Mjg2MC8xNTE0NDE0OS5wbmc=/250x600/mgvr%2Bk.png"
        ],
        description: `Arcade game created for the Nokia 3310 Jam 6th Edition.

GAME FEATURES:
- Authentic Nokia 3310 experience with 84x48 pixel resolution
- Retro monochrome graphics faithful to the original hardware
- Classic arcade shooter gameplay
- One-button controls for maximum accessibility
- Original Nokia-style sound effects

JAM SPECIFICATIONS:
The Hole was created following strict Nokia 3310 Jam rules:
- Resolution: 84x48 pixels (scaled for modern displays)
- Display: Monochrome palette matching original Nokia screen
- Audio: Single-channel sound effects (no overlapping audio)
- Controls: 12-key keypad layout (arrow keys supported)
- Authentic retro gaming experience

HOW TO PLAY:
Navigate through the hole, avoid obstacles, and survive as long as possible. Simple controls, challenging gameplay - just like the golden age of mobile gaming!

TECHNICAL DETAILS:
Built with modern tools while respecting vintage hardware limitations. Experience genuine retro gaming without compromises.`,
        releaseDate: "February 24th 2024", 
        version: "1.0.0",
        genre: ["Action", "Arcade"], 
        tags: ["Pixel Art", "Retro", "Shooter"], 
        downloadLinks: [
            { platform: "Windows", size: "0.8 MB", url: "/downloads/TheHole.zip" },  
        ],
        hasWebVersion: true,
        webGameUrl: "https://html-classic.itch.zone/html/9796945/index.html", 
        rating: 4.5,
        downloads: 0
    };
    
  return (
    <div className={styles.showcasePage}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
            <div className={styles.heroOverlay}></div>
            <div className="container">
                <div className={styles.heroContent}>
                    <h1 className={styles.gameTitle}>Community Showcase</h1>
                    <div className={styles.introText}>
                        <p className={styles.introParagraph}>
                            Welcome to our Community Games section! This space is dedicated to showcasing 
                            indie HTML5 games created by talented hobby developers from our community. 
                            Each month, we handpick a game that deserves the spotlight - a fun way to 
                            pass the time while discovering passionate indie creators.
                        </p>
                        <div className={styles.featuredBadge}>
                            
                            <span className={styles.badgeText}>Featured Game of the Month</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Game Title Section */}
        <div className="container">
            <div className={styles.gameTitleSection}>
                <h2 className={styles.gameMainTitle}>{game.title}</h2>
                <div className={styles.gameMeta}>
                    <span className={styles.metaItem}>
                        <span className={styles.metaLabel}>By</span> {game.developer.name}
                    </span>
                    <span className={styles.metaItem}>
                        <span className={styles.metaLabel}>Released</span> {game.releaseDate}
                    </span>
                    <span className={styles.metaItem}>
                        ⭐ {game.rating} • {game.downloads} downloads
                    </span>
                </div>
            </div>
        </div>

        <div className="container mt-5">
                {/* Layout con gioco al centro e sidebar ai lati */}
                <div className="row g-4 mb-5">
                    {/* Sidebar Sinistra */}
                    <div className="col-12 col-lg-3 order-2 order-lg-1">
                        {/* Developer Card */}
                        <div className={styles.developerCard}>
                            <h3 className={styles.developerTitle}>Developer</h3>
                            <div className={styles.developerInfo}>
                                <img 
                                    src={game.developer.avatar} 
                                    alt={game.developer.name}
                                    className={styles.developerAvatar}
                                />
                                <div className={styles.developerDetails}>
                                    <div className={styles.developerName}>{game.developer.name}</div>
                                    <div className={styles.developerJoinDate}>{game.developer.joinDate}</div>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className={styles.tagsCard}>
                            <h3 className={styles.tagsTitle}>Tags</h3>
                            <div className={styles.tagsList}>
                                {game.tags.map((tag, index) => (
                                    <span key={index} className={styles.tag}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Centro - Player */}
                    <div className="col-12 col-lg-6 order-1 order-lg-2">
                        {game.hasWebVersion && (
                            <div className={styles.playerSection}>
                                {!showPlayer ? (
                                    <div className={styles.playerPlaceholder}>
                                        <div className={styles.placeholderContent}>
                                            
                                            <button 
                                                className={styles.runGameButton}
                                                onClick={() => setShowPlayer(true)}
                                            >
                                                Run Game
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.playerActive}>
                                        <iframe
                                            scrolling="no"
                                            id="game_drop"
                                            allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr; cross-origin-isolated; web-share"
                                            src={game.webGameUrl}
                                            allowTransparency="true"
                                            frameBorder="0"
                                            allowFullScreen
                                            title={game.title}
                                            className={styles.gameIframe}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar Destra */}
                    <div className="col-12 col-lg-3 order-3">
                        {/* Download Section */}
                        <div className={styles.downloadSection}>
                            <h3 className={styles.downloadTitle}>Download</h3>
                            <div className={styles.downloadLinks}>
                                {game.downloadLinks.map((link, index) => (
                                    <a 
                                        key={index}
                                        href={link.url} 
                                        className={styles.downloadButton}
                                        download="TheHole.zip" 
                                    >
                                        <div className={styles.downloadIcon}>💾</div>
                                        <div className={styles.downloadInfo}>
                                            <div className={styles.downloadPlatform}>{link.platform}</div>
                                            <div className={styles.downloadSize}>{link.size}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Game Info */}
                        <div className={styles.infoCard}>
                            <h3 className={styles.infoTitle}>Information</h3>
                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Version</span>
                                    <span className={styles.infoValue}>{game.version}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Genre</span>
                                    <span className={styles.infoValue}>{game.genre.join(', ')}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Release Date</span>
                                    <span className={styles.infoValue}>{game.releaseDate}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Rating</span>
                                    <span className={styles.infoValue}>⭐ {game.rating}/5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Screenshots - Full Width sotto il player */}
                <div className="row">
                    <div className="col-12">
                        <div className={styles.screenshotsSection}>
                            <h2 className={styles.sectionTitle}>Screenshots</h2>
                            <div className={styles.screenshotsGrid}>
                                {game.screenshots.map((screenshot, index) => (
                                    <div key={index} className={styles.screenshotCard}>
                                        <img 
                                            src={screenshot} 
                                            alt={`Screenshot ${index + 1}`}
                                            className={`${styles.screenshotImage} hasElectricity`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className={styles.descriptionSection}>
                            <h2 className={styles.sectionTitle}>About this game</h2>
                            <div className={styles.descriptionContent}>
                                {game.description.split('\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}