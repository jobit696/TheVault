import { useState } from "react";
import { useLoaderData } from "react-router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ToggleFavorite from "../../components/ui/ToggleFavorite";
import styles from "../../css/GamePage.module.css";
import Chatbox from "../../components/chat/Chatbox";
import { useYoutubeChannel } from "../../context/YoutubeChannelContext";
import InteractiveImageCard from "../../components/cards/InteractiveImageCard";
import PlatformPageCard from "../../components/cards/PlatformPageCard";
import gamepadImage from "../../assets/images/Gamepad.png";
import YouTubeGameVideo from "../../components/youtube/YoutubeGameVideo";

export default function GamePage() {
    const { game, screenshots, dlcs, similarGames } = useLoaderData();
    const [selectedImage, setSelectedImage] = useState(null);
    const { channelId } = useYoutubeChannel();

    return (
        <div className={styles.gamePage}>
            {/* Hero Section */}
            <div className={styles.heroSection}>
                <LazyLoadImage
                    src={game?.background_image}
                    alt={game?.name}
                    effect="blur"
                    className={styles.heroImage}
                    wrapperProps={{
                        style: {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%'
                        }
                    }}
                />
                
                <div className={styles.heroOverlay}></div>

                <div className={`container pb-5 ${styles.heroContent}`}>
                    <div className="row">
                        <div className={`col-12 col-lg-7`}>
                            <h1 className={styles.gameTitle}>
                                {game?.name}
                            </h1>

                            <div className={`mb-3 ${styles.heroInfo}`}>
                                {game?.rating >= 4.2 && (
                                    <span className={`badge bg-danger me-2 ${styles.topRatedBadge}`}>
                                        TOP RATED
                                    </span>
                                )}
                                <span className={styles.metadataText}>
                                    {new Date(game?.released).getFullYear()}
                                </span>
                                <span className={styles.metadataText}>
                                    ⭐ {game?.rating}
                                </span>
                               {game?.playtime > 0 && (
                                    <span className={`${styles.metadataText} ${styles.playtimeContainer}`}>
                                        <img className={styles.playtimeImage} src={gamepadImage} alt="" />
                                        <span className={styles.playtimeText}>{game.playtime}h</span>
                                    </span>
                                )}
                            </div>

                            <div className={styles.favoriteButton} onClick={(e) => e.preventDefault()}>
                                <ToggleFavorite data={game} />
                            </div>

                            {game?.genres && game.genres.length > 0 && (
                                <div className="mb-3">
                                    <span className={styles.genreLabel}>Genres:</span>
                                    {game.genres.map((genre, index) => (
                                        <span key={genre.id} className={styles.genreText}>
                                            {genre.name}{index < game.genres.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <p className={styles.description}>
                                {game?.description_raw?.substring(0, 300)}...
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="container mt-4">
                <div className="row">
                    <div className="col-12 col-lg-8">
                        <p className={styles.fullDescription}>
                            {game?.description_raw}
                        </p>
                    </div>
                    
                    <div className="col-12 col-lg-4">
                        <div className={styles.infoText}>
                            {game?.developers && game.developers.length > 0 && (
                                <p>
                                    <span className={styles.infoLabel}>Developers: </span>
                                    {game.developers.map(dev => dev.name).join(', ')}
                                </p>
                            )}
                            {game?.publishers && game.publishers.length > 0 && (
                                <p>
                                    <span className={styles.infoLabel}>Publishers: </span>
                                    {game.publishers.map(pub => pub.name).join(', ')}
                                </p>
                            )}
                            {game?.platforms && game.platforms.length > 0 && (
                                <p>
                                    <span className={styles.infoLabel}>Platforms: </span>
                                    {game.platforms.map(p => p.platform.name).join(', ')}
                                </p>
                            )}
                            {game?.esrb_rating && (
                                <p>
                                    <span className={styles.infoLabel}>ESRB Rating: </span>
                                    {game.esrb_rating.name}
                                </p>
                            )}
                            <p>
                                <span className={styles.infoLabel}>DLC: </span>
                                {dlcs && dlcs.length > 0 ? `Yes (${dlcs.length})` : 'No'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Screenshots Section */}
            <div className="container mt-5 pb-5 text-sm-center">
                <h2 className={styles.sectionTitleBan3}>
                    Screenshots
                </h2>

                <div className="row g-5">
                    {screenshots.map((screenshot) => (
                        <div key={screenshot.id} className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                            <div 
                                className={styles.screenshotCard}
                                onClick={() => setSelectedImage(screenshot.image)}
                                style={{ cursor: 'pointer' }}
                            >
                                <LazyLoadImage
                                    src={screenshot.image}
                                    alt={`${game?.name} screenshot`}
                                    effect="blur"
                                    threshold={400}
                                    className={styles.screenshotImage}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal per immagine ingrandita */}
                {selectedImage && (
                    <div 
                        className={styles.imageModal}
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <button 
                                className={styles.closeButton}
                                onClick={() => setSelectedImage(null)}
                            >
                                ×
                            </button>
                            <img 
                                src={selectedImage} 
                                alt="Screenshot ingrandito"
                                className={styles.modalImage}
                            />
                        </div>
                    </div>
                )}

                {/* VIDEO CANALE SCELTO */}
                <YouTubeGameVideo 
                    gameName={game?.name} 
                    channelId={channelId} 
                />

                {/* DLC Section */}
                {dlcs && dlcs.length > 0 && (
                    <div className="mt-5">
                        <h2 className={styles.sectionTitleBan1}>
                            DLC
                        </h2>

                        <div className="row g-4 mt-3">
                            {dlcs.map((dlc) => (
                                <div key={dlc.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                    <InteractiveImageCard
                                        url={dlc.background_image}
                                        title={dlc.name}
                                        show_number={false}
                                        gioco={dlc}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Similar Games Section */}
                {similarGames && similarGames.length > 0 && (
                    <div className="mt-5">
                        <h2 className={styles.sectionTitleBan2}>
                            Similar Games
                        </h2>

                        <div className="row g-4 mt-3">
                            {similarGames.slice(0, 8).map((similar) => (
                                <div key={similar.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                                    <PlatformPageCard game={similar} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chat Section */}
                <div className="style-chatbox mt-5">
                    <Chatbox data={game} />
                </div>
            </div>
        </div>
    );
}