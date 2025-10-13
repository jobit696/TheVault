import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router';
import { useSession } from '../../context/SessionContext';
import { useAdmin } from '../../context/AdminContext';
import { banUser, unbanUser, isUserBanned } from '../../services/userManagementService';
import supabase from '../../supabase/supabase-client';
import styles from '../../css/AccountPage.module.css';

export default function UserProfilePage() {
  const { userId } = useParams();
  const { session } = useSession();
  const { isAdmin } = useAdmin();
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBanned, setIsBanned] = useState(false);
  const [banLoading, setBanLoading] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');

  // Redirect ad account se stai guardando il tuo profilo
  if (session?.user?.id === userId) {
    return <Navigate to="/account" replace />;
  }

  useEffect(() => {
    async function loadUserProfile() {
      setLoading(true);
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (favoritesError) throw favoritesError;
        setFavorites(favoritesData || []);

        if (isAdmin) {
          const banned = await isUserBanned(userId);
          setIsBanned(banned);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadUserProfile();
    }
  }, [userId, isAdmin]);

  const handleBan = async () => {
    if (!confirm('Ban this user? All their messages will be deleted permanently.')) {
      setShowBanModal(false);
      return;
    }

    setBanLoading(true);
    try {
      await banUser(userId, banReason);
      alert('User banned successfully');
      setIsBanned(true);
      setShowBanModal(false);
      setBanReason('');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setBanLoading(false);
    }
  };

  const handleUnban = async () => {
    if (!confirm('Unban this user?')) return;

    setBanLoading(true);
    try {
      await unbanUser(userId);
      alert('User unbanned successfully');
      setIsBanned(false);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setBanLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="loader-spinner-large"></div>
          <p style={{ color: 'white' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">User not found or error loading profile.</div>
      </div>
    );
  }

  // Calcola statistiche
  const totalGames = favorites.length;
  const genresMap = {};

  favorites.forEach((fav) => {
    if (fav.genres) {
      const genres = fav.genres.split(',').map((g) => g.trim());
      genres.forEach((genre) => {
        genresMap[genre] = (genresMap[genre] || 0) + 1;
      });
    }
  });

  const genresArray = Object.entries(genresMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topGenre = genresArray[0]?.[0] || 'None';
  const latestFavorite = favorites[0];

  return (
    <div className={styles.container}>
      {/* ===== PAGE HEADER ===== */}
      <div className={styles.pageHeader}>
        <i className="fas fa-user"></i>
      </div>

      {/* ===== AVATAR E INFO ===== */}
      <div className={styles.formWidget} style={{ marginBottom: '30px' }}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarCircle}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" />
            ) : (
              <img src="../images/default-avatar.png" alt="Avatar" />
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#fff', marginBottom: '5px', fontSize: '1.5rem' }}>
              {profile.username || 'Anonymous User'}
            </h2>
            {profile.first_name && profile.last_name && (
              <p style={{ color: '#868686', margin: 0 }}>
                {profile.first_name} {profile.last_name}
              </p>
            )}

            <div
              style={{
                marginTop: '10px',
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {profile.is_admin && <span className="badge bg-danger">ADMIN</span>}
              {isBanned && <span className="badge bg-warning text-dark">BANNED</span>}
            </div>

            {/* ===== BOTTONI BAN/UNBAN ===== */}
            {isAdmin && !profile.is_admin && (
              <div style={{ marginTop: '20px' }}>
                {isBanned ? (
                  <button
                    onClick={handleUnban}
                    disabled={banLoading}
                    className={styles.submitButton}
                    style={{
                      background: 'linear-gradient(145deg, #28a745, #218838)',
                      maxWidth: '300px',
                      margin: '0 auto',
                    }}
                  >
                    {banLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Unbanning...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-unlock me-2"></i>
                        Unban User
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    {showBanModal ? (
                      <div
                        style={{
                          background: 'rgba(209, 29, 4, 0.1)',
                          padding: '20px',
                          borderRadius: '10px',
                          border: '1px solid rgba(209, 29, 4, 0.3)',
                          maxWidth: '400px',
                          margin: '0 auto',
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Ban reason (optional)"
                          value={banReason}
                          onChange={(e) => setBanReason(e.target.value)}
                          className={styles.formInput}
                          style={{ marginBottom: '15px' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={handleBan}
                            disabled={banLoading}
                            className={styles.submitButton}
                            style={{ flex: 1 }}
                          >
                            {banLoading ? '⏳' : 'Confirm Ban'}
                          </button>
                          <button
                            onClick={() => {
                              setShowBanModal(false);
                              setBanReason('');
                            }}
                            className={styles.submitButton}
                            style={{
                              flex: 1,
                              background: 'linear-gradient(145deg, #555, #444)',
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowBanModal(true)}
                        className={styles.submitButton}
                        style={{ maxWidth: '300px', margin: '0 auto' }}
                      >
                        <i className="fas fa-ban me-2"></i>
                        Ban User
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== STATISTICS ===== */}
      <div className={styles.sectionWidget} style={{ marginBottom: '30px' }}>
        <h3 className={styles.sectionTitle}>
          <i className="fas fa-chart-bar me-2"></i> Statistics
        </h3>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{totalGames}</div>
              <div className={styles.statLabel}>Favorite Games</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{Object.keys(genresMap).length}</div>
              <div className={styles.statLabel}>Genres</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{topGenre}</div>
              <div className={styles.statLabel}>Top Genre</div>
            </div>
          </div>

          {latestFavorite && (
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statNumber} style={{ fontSize: '1rem' }}>
                  {latestFavorite.game_name?.substring(0, 15)}...
                </div>
                <div className={styles.statLabel}>Latest Favorite</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== TOP GENRES ===== */}
      {genresArray.length > 0 && (
        <div className={styles.sectionWidget} style={{ marginBottom: '30px' }}>
          <h3 className={styles.sectionTitle}>
            <i className="fas fa-chart-bar me-2"></i> Favorite Genres
          </h3>
          <div className={styles.genresList}>
            {genresArray.map(([genre, count]) => {
              const percentage = (count / totalGames) * 100;
              return (
                <div key={genre} className={styles.genreItem}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '5px',
                    }}
                  >
                    <span className={styles.genreName}>{genre}</span>
                    <span className={styles.genreCount}>{count} games</span>
                  </div>
                  <div className={styles.genreBar}>
                    <div
                      className={styles.genreBarFill}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== FAVORITE GAMES ===== */}
      <div className={styles.sectionWidget} style={{ marginBottom: '30px' }}>
        <h3 className={styles.sectionTitle}>
          <i className="fas fa-heart me-2"></i> Favorite Games ({totalGames})
        </h3>

        {favorites.length === 0 ? (
          <p style={{ color: '#868686', textAlign: 'center', padding: '2rem' }}>
            No favorite games yet.
          </p>
        ) : (
          <div className={styles.gamesGrid}>
            {favorites.map((fav) => (
              <a
                key={fav.id}
                href={`/games/${fav.game_slug}/${fav.game_id}`}
                className={styles.gameCard}
              >
                <div className={styles.gameImagePlaceholder}>
                  <img
                    src={fav.game_image}
                    alt={fav.game_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {fav.game_rating && (
                    <div className={styles.gameRating}>⭐ {fav.game_rating}</div>
                  )}
                </div>
                <div className={styles.gameName}>{fav.game_name}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
