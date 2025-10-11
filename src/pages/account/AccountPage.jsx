/* @refresh reset */
import { useState, useEffect, useContext } from 'react';
import supabase from '../../supabase/supabase-client';
import SessionContext from '../../context/SessionContext';
import Avatar from '../../components/ui/Avatar';
import YoutubeChannelSettings from '../../components/youtube/YoutubeChannelSettings';
import { Link } from 'react-router';
import styles from '../../css/AccountPage.module.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAdmin } from '../../context/AdminContext';
import { updateSiteSettings } from '../../services/siteSettingsService'; // ← AGGIUNTO

dayjs.extend(relativeTime);

export default function AccountPage() {
  const { session } = useContext(SessionContext);
  const { isAdmin, showAdminOptions, setShowAdminOptions, disableRelatedVideos, setDisableRelatedVideos } = useAdmin(); // ← MODIFICATO

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [first_name, setFirstName] = useState(null);
  const [last_name, setLastName] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const [lastMessageGame, setLastMessageGame] = useState(null);

  const gameStats = {
    totalGames: favoriteGames.length,
    totalGenres: favoriteGenres.length,
    topGenre: favoriteGenres[0]?.name || 'N/A',
    newestFavorite: favoriteGames[0]?.game_name || 'N/A'
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
        .select('username, first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setFirstName(data.first_name);
          setLastName(data.last_name);
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

  // ← AGGIUNTO: Handler per disabilitare video
  const handleToggleRelatedVideos = async (e) => {
    const newValue = e.target.checked;
    
    try {
      await updateSiteSettings({ disable_related_videos: newValue });
      setDisableRelatedVideos(newValue);
    } catch (error) {
      alert('Errore aggiornamento impostazioni: ' + error.message);
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
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{gameStats.totalGames}</div>
              <div className={styles.statLabel}>Favorite Games</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{gameStats.totalGenres}</div>
              <div className={styles.statLabel}>Genres</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{gameStats.topGenre}</div>
              <div className={styles.statLabel}>Top Genre</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber} style={{ fontSize: '0.8rem' }}>
                {gameStats.newestFavorite.length > 15 
                  ? gameStats.newestFavorite.substring(0, 15) + '...' 
                  : gameStats.newestFavorite}
              </div>
              <div className={styles.statLabel}>Latest Favorite</div>
            </div>
          </div>

          <div className={styles.sectionWidget}>
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

      {/* Impostazioni YouTube Channel */}
      <YoutubeChannelSettings />

      {/* ========== SEZIONE ADMIN ========== */}
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

            {/* ← AGGIUNTO: Checkbox per disabilitare video */}
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
              </div>
            )}

            {/* Info quando video sono disabilitati */}
            {disableRelatedVideos && (
              <div className={styles.adminOptionsPanel} style={{ marginTop: '15px', borderColor: 'rgba(230, 57, 70, 0.3)', background: 'rgba(230, 57, 70, 0.1)' }}>
                <p className={styles.adminOptionsText}>
                  - Related videos are disabled for all users
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Last Message Widget */}
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

      <div className={styles.sectionWidget}>
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