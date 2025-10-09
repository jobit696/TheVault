import { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import styles from '../../css/YouTubeGameVideo.module.css';

const YouTubeGameVideo = ({ gameName, channelId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videosPerSlide, setVideosPerSlide] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVideosPerSlide(1);
      } else if (window.innerWidth < 1200) {
        setVideosPerSlide(1);
      } else {
        setVideosPerSlide(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

useEffect(() => {
  const fetchVideos = async () => {
    if (!gameName || !channelId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_YOUTUBE_KEY;
      
      if (!apiKey) {
        throw new Error('YouTube API key non configurata');
      }

      // Rimuovi sottotitoli e caratteri speciali dalla query
      const cleanGameName = gameName.split(':')[0].trim(); 
      
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&q=${encodeURIComponent(cleanGameName)}&key=${apiKey}&maxResults=5&order=relevance&type=video`;

      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Quota API esaurita o chiave non valida');
        } else if (response.status === 429) {
          throw new Error('Troppe richieste. Riprova tra qualche minuto');
        }
        throw new Error(`Errore API: ${response.status}`);
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        // rimuove caratteri speciali
        const normalizeText = (text) => {
          return text
            .toLowerCase()
            .replace(/[:\-–—()]/g, ' ')
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        };

        // Parola principale del gioco 
        const mainWord = normalizeText(cleanGameName).split(' ')[0];

        // Filtra video che contengono almeno la parola principale
        const filteredVideos = data.items.filter(item => {
          const titleNormalized = normalizeText(item.snippet.title);
          return titleNormalized.includes(mainWord);
        });

        // Usa video filtrati se ci sono oppure primi 3
        const videosToUse = filteredVideos.length > 0 
          ? filteredVideos.slice(0, 3)
          : data.items.slice(0, 3);

        const videoList = videosToUse.map(item => ({
          videoId: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          channelTitle: item.snippet.channelTitle
        }));

        setVideos(videoList);
      } else {
        setVideos([]);
      }
    } catch (err) {
      setError(err.message);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  fetchVideos();
}, [gameName, channelId]);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Caricamento video...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !videos || videos.length === 0) {
    return null;
  }

  // Video in gruppi per slide
  const chunkedVideos = [];
  for (let i = 0; i < videos.length; i += videosPerSlide) {
    chunkedVideos.push(videos.slice(i, i + videosPerSlide));
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
  <div className={`container-fluid ${styles.videoCarouselWrapper} mt-5`}>
    <h2 className={styles.sectionTitleBan4}>
      Related videos
    </h2>

    <Carousel 
      interval={null} 
      indicators={videos.length > 1} 
      controls={videos.length > 1}   
      prevIcon={prevIcon}
      nextIcon={nextIcon}
    >
      {chunkedVideos.map((gruppo, slideIndex) => (
        <Carousel.Item key={slideIndex}>
          <div className={`d-flex justify-content-center ${styles.carouselVideosContainer} my-4 py-4`}>
            {gruppo.map((video) => (
              <div key={video.videoId} className={styles.carouselVideoItem}>
                <div className={styles.videoCard}>
                  <div className={styles.videoWrapper}>
                    <iframe
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className={styles.videoFrame}
                    ></iframe>
                  </div>
                  <div className={styles.videoInfo}>
                    <h4 className={styles.videoTitle}>{video.title}</h4>
                    <p className={styles.channelName}>{video.channelTitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  </div>
);
};

export default YouTubeGameVideo;