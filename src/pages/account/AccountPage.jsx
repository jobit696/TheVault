/* @refresh reset */
import { useState, useEffect, useContext, useRef } from 'react';
import supabase from '../../supabase/supabase-client';
import SessionContext from '../../context/SessionContext';
import Avatar from '../../components/ui/Avatar';
import YoutubeChannelSettings from '../../components/youtube/YoutubeChannelSettings';
import { Link, useNavigate } from 'react-router';
import styles from '../../css/AccountPage.module.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAdmin } from '../../context/AdminContext';
import { updateSiteSettings } from '../../services/siteSettingsService'; 
import UserManagement from '../../components/admin/UserManagement';

dayjs.extend(relativeTime);

export default function AccountPage() {
  const { session } = useContext(SessionContext);
  const { isAdmin, showAdminOptions, setShowAdminOptions, disableRelatedVideos, setDisableRelatedVideos } = useAdmin();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [first_name, setFirstName] = useState(null);
  const [last_name, setLastName] = useState(null);
  const [sex, setSex] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const [lastMessageGame, setLastMessageGame] = useState(null);

  // Refs per scrollare alle sezioni
  const favoriteGamesRef = useRef(null);
  const genresRef = useRef(null);

  const gameStats = {
    totalGames: favoriteGames.length,
    totalGenres: favoriteGenres.length,
    topGenre: favoriteGenres[0]?.name || 'N/A',
    newestFavorite: favoriteGames[0]?.game_name || 'N/A',
    newestFavoriteSlug: favoriteGames[0]?.game_slug || null,
    newestFavoriteId: favoriteGames[0]?.game_id || null
  };

  const calculateFavoriteGenres = (games) => {
    if (games.length === 0) {
      setFavoriteGenres([]);
      return;
    }

    const genreCount = {};

    games.forEach(game => {
      if (game.genres) {
        const firstGenre = game.genres.split(',')[0]?.trim();
        if (firstGenre) {
          genreCount[firstGenre] = (genreCount[firstGenre] || 0) + 1;
        }
      }
    });

    const sortedGenres = Object.entries(genreCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setFavoriteGenres(sortedGenres);
  };

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }

    let ignore = false;
    const getProfile = async () => {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from('profiles')
        .select('username, first_name, last_name, sex, avatar_url')
        .eq('id', user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setSex(data.sex);
          setAvatarUrl(data.avatar_url);
        }
      }

      setLoading(false);
    };

    const getFavorites = async () => {
      const { user } = session;

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (!error && data) {
        setFavoriteGames(data);
        calculateFavoriteGenres(data);
      } else if (error) {
        console.error("Error loading favorites:", error);
      }
    };

    const getLastMessage = async () => {
      const { user } = session;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setLastMessage(data[0]);
        
        const game = favoriteGames.find(g => g.game_id === data[0].game_id);
        if (game) {
          setLastMessageGame(game);
        }
      }
    };

    getProfile();
    getFavorites();
    getLastMessage();

    return () => {
      ignore = true;
    };
  }, [session]);

  const updateProfile = async (event, avatarUrl) => {
    event.preventDefault();

    setLoading(true);
    const { user } = session;

    const updates = {
      id: user.id,
      username,
      first_name,
      last_name,
      sex,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      alert(error.message);
    } else {
      setAvatarUrl(avatarUrl);
    }
    setLoading(false);
  };

  const removeFavorite = async (gameId) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('game_id', gameId)
      .eq('user_id', session.user.id);

    if (error) {
      alert(error.message);
    } else {
      const updatedFavorites = favoriteGames.filter(game => game.game_id !== gameId);
      setFavoriteGames(updatedFavorites);
      calculateFavoriteGenres(updatedFavorites);
    }
  };

  const handleToggleRelatedVideos = async (e) => {
    const newValue = e.target.checked;
    
    try {
      await updateSiteSettings({ disable_related_videos: newValue });
      setDisableRelatedVideos(newValue);
    } catch (error) {
      alert('Errore aggiornamento impostazioni: ' + error.message);
    }
  };

  // Funzioni per gestire i click sulle stat cards
  const handleTotalGamesClick = () => {
    favoriteGamesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleGenresClick = () => {
    genresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTopGenreClick = () => {
    if (gameStats.topGenre !== 'N/A') {
      // Converte il nome del genere in formato URL-friendly (lowercase, spazi con trattini)
      const genreSlug = gameStats.topGenre.toLowerCase().replace(/\s+/g, '-');
      navigate(`/genre/${genreSlug}`);
    }
  };

  const handleLatestFavoriteClick = () => {
    if (gameStats.newestFavoriteSlug && gameStats.newestFavoriteId) {
      navigate(`/games/${gameStats.newestFavoriteSlug}/${gameStats.newestFavoriteId}`);
    }
  };

  if (!session || !session.user) {
    return (
      <div className={styles.container}>
        <div className="page-loader">
          <div className="loader-spinner-large"></div>
          <p className="loader-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <i className="fas fa-cog"></i>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <form onSubmit={updateProfile} className={styles.formWidget}>
            <Avatar
              url={avatar_url}
              size={150}
              onUpload={(event, url) => {
                updateProfile(event, url);
              }}
            />
            
            <div className={styles.formField}>
              <label htmlFor="email" className={styles.formLabel}>Email</label>
              <input 
                id="email" 
                type="text" 
                value={session.user.email} 
                disabled 
                className={styles.formInput}
              />
            </div>
            
            <div className={styles.formField}>
              <label htmlFor="username" className={styles.formLabel}>Username</label>
              <input
                id="username"
                type="text"
                required
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.formInput}
              />
            </div>
            
            <div className={styles.formField}>
              <label htmlFor="first_name" className={styles.formLabel}>First name</label>
              <input
                id="first_name"
                type="text"
                value={first_name || ''}
                onChange={(e) => setFirstName(e.target.value)}
                className={styles.formInput}
              />
            </div>
            
            <div className={styles.formField}>
              <label htmlFor="last_name" className={styles.formLabel}>Last name</label>
              <input
                id="last_name"
                type="text"
                value={last_name || ''}
                onChange={(e) => setLastName(e.target.value)}
                className={styles.formInput}
              />
            </div>

            {/* Gender */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>Gender</label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginTop: '10px'
              }}>
                {sex === 'M' ? (
                  <span style={{ 
                    color: '#d11d04', 
                    fontWeight: 700, 
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <i className="fas fa-mars" style={{ fontSize: '1.3rem' }}></i> Male
                  </span>
                ) : sex === 'F' ? (
                  <span style={{ 
                    color: '#d11d04', 
                    fontWeight: 700, 
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <i className="fas fa-venus" style={{ fontSize: '1.3rem' }}></i> Female
                  </span>
                ) : (
                  <span style={{ color: '#868686' }}>Not specified</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Loading ...' : 'Update'}
            </button>
          </form>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.statsGrid}>
            {/* Stat Card: Total Games */}
            <div 
              className={styles.statCard} 
              onClick={handleTotalGamesClick}
              style={{ cursor: 'pointer' }}
              title="Click to view favorite games"
            >
              <div className={styles.statNumber}>{gameStats.totalGames}</div>
              <div className={styles.statLabel}>Favorite Games</div>
            </div>

            {/* Stat Card: Genres  */}
            <div 
              className={styles.statCard}
              onClick={handleGenresClick}
              style={{ cursor: 'pointer' }}
              title="Click to view favorite genres"
            >
              <div className={styles.statNumber}>{gameStats.totalGenres}</div>
              <div className={styles.statLabel}>Genres</div>
            </div>

            {/* Stat Card: Top Genre */}
            <div 
              className={styles.statCard}
              onClick={handleTopGenreClick}
              style={{ cursor: gameStats.topGenre !== 'N/A' ? 'pointer' : 'default' }}
              title={gameStats.topGenre !== 'N/A' ? `Click to view ${gameStats.topGenre} games` : ''}
            >
              <div className={styles.statNumber}>{gameStats.topGenre}</div>
              <div className={styles.statLabel}>Top Genre</div>
            </div>

            {/* Stat Card: Latest Favorite */}
            <div 
              className={styles.statCard}
              onClick={handleLatestFavoriteClick}
              style={{ cursor: gameStats.newestFavoriteSlug ? 'pointer' : 'default' }}
              title={gameStats.newestFavoriteSlug ? `Click to view ${gameStats.newestFavorite}` : ''}
            >
              <div className={styles.statNumber} style={{ fontSize: '0.8rem' }}>
                {gameStats.newestFavorite.length > 15 
                  ? gameStats.newestFavorite.substring(0, 15) + '...' 
                  : gameStats.newestFavorite}
              </div>
              <div className={styles.statLabel}>Latest Favorite</div>
            </div>
          </div>

          {/* Sezione Favorite Genres con ref */}
          <div className={styles.sectionWidget} ref={genresRef}>
            <h3 className={styles.sectionTitle}>- Favorite Genres</h3>
            {favoriteGenres.length === 0 ? (
              <p style={{ color: '#868686', textAlign: 'center', padding: '20px' }}>
                Add favorite games to see your favorite genres!
              </p>
            ) : (
              <div className={styles.genresList}>
                {favoriteGenres.map((genre, index) => {
                  const maxCount = favoriteGenres[0].count;
                  return (
                    <div key={index} className={styles.genreItem}>
                      <span className={styles.genreName}>{genre.name}</span>
                      <span className={styles.genreCount}>{genre.count} games</span>
                      <div className={styles.genreBar}>
                        <div 
                          className={styles.genreBarFill} 
                          style={{ width: `${(genre.count / maxCount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <YoutubeChannelSettings />

      {isAdmin && (
        <div className={styles.adminSection}>
          <h3 className={styles.adminTitle}>
            <i className="fas fa-shield-alt"></i> Administration
          </h3>
          
          <div className={styles.adminPanel}>
            <div className={styles.adminCheckboxGroup}>
              <label className={styles.adminCheckboxLabel}>
                <input
                  type="checkbox"
                  checked={showAdminOptions}
                  onChange={(e) => setShowAdminOptions(e.target.checked)}
                  className={styles.adminCheckbox}
                />
                <span className={styles.adminCheckboxText}>
                  Show admin's options
                </span>
              </label>
            </div>

            <div className={styles.adminCheckboxGroup}>
              <label className={styles.adminCheckboxLabel}>
                <input
                  type="checkbox"
                  checked={disableRelatedVideos}
                  onChange={handleToggleRelatedVideos}
                  className={styles.adminCheckbox}
                />
                <span className={styles.adminCheckboxText}>
                  Disable related videos
                </span>
              </label>
            </div>

            {showAdminOptions && (
              <div className={styles.adminOptionsPanel}>
                <p className={styles.adminOptionsText}>
                  - Admin options are now visible on cards
                </p>
                <p className={styles.adminOptionsText}>
                  - "Add to Most Anticipated" button (bottom-right corner of Game Page)
                </p>
              </div>
            )}

            {disableRelatedVideos && (
              <div className={styles.adminOptionsPanel} style={{ marginTop: '15px', borderColor: 'rgba(230, 57, 70, 0.3)', background: 'rgba(230, 57, 70, 0.1)' }}>
                <p className={styles.adminOptionsText}>
                  - Related videos are disabled for all users
                </p>
              </div>
            )}
          </div>

          <UserManagement />
        </div>
      )}

      {lastMessage && (
        <div className={styles.lastMessageWidget}>
          <h3 className={styles.lastMessageTitle}>- Latest Chat Activity</h3>
          <div className={styles.lastMessageCard}>
            <div className={styles.lastMessageHeader}>
              <span className={styles.lastMessageGameName}>
                {lastMessage.game_name ? lastMessage.game_name : `Game ID: ${lastMessage.game_id}`}
              </span>
              <span className={styles.lastMessageTime}>
                {dayjs(lastMessage.created_at).fromNow()}
              </span>
            </div>
            <div className={styles.lastMessageContent}>
              "{lastMessage.content}"
            </div>
            <Link 
              to={`/games/${lastMessage.game_slug}/${lastMessage.game_id}`} 
              className={styles.lastMessageLink}
            >
              View conversation →
            </Link>
          </div>
        </div>
      )}

      {/* Sezione Favorite Games con ref */}
      <div className={styles.sectionWidget} ref={favoriteGamesRef}>
        <h3 className={styles.sectionTitle}>- Favorite Games ({favoriteGames.length})</h3>
        {favoriteGames.length === 0 ? (
          <p style={{ color: '#868686', textAlign: 'center', padding: '20px' }}>
            No favorite games yet. Start adding games to your favorites!
          </p>
        ) : (
          <div className={styles.gamesGrid}>
            {favoriteGames.map(game => (
              <div key={game.id} className={`${styles.gameCard} hasElectricity`}>
                <button 
                  className={styles.removeButton}
                  onClick={() => removeFavorite(game.game_id)}
                  title="Remove from favorites"
                >
                  ×
                </button>
                <Link to={`/games/${game.game_slug}/${game.game_id}`}>
                  <div 
                    className={styles.gameImagePlaceholder}
                    style={{
                      backgroundImage: game.game_image ? `url(${game.game_image})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                  </div>
                  <div className={styles.gameName}>{game.game_name}</div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}