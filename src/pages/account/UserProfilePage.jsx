import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router';
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
      <div className={styles.container}>
        <div className="page-loader">
          <div className="loader-spinner-large"></div>
          <p className="loader-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.container}>
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
      const firstGenre = genres[0];
      if (firstGenre) {
        genresMap[firstGenre] = (genresMap[firstGenre] || 0) + 1;
      }
    }
  });

  const genresArray = Object.entries(genresMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topGenre = genresArray[0]?.[0] || 'N/A';
  const latestFavorite = favorites[0];

  return (
    <div className={styles.container}>
      {/* ===== PAGE HEADER ===== */}
      <div className={styles.pageHeader}>
        <i className="fas fa-user"></i>
      </div>

      <div className={styles.mainGrid}>
        {/* ===== LEFT COLUMN ===== */}
        <div className={styles.leftColumn}>
          <div className={styles.formWidgetPublic}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%'
            }}>
              <div className={styles.avatarCircle} style={{ width: '150px', height: '150px' }}>
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  <img src="../images/default-avatar.png" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                )}
              </div>

              <div style={{ textAlign: 'center', marginTop: '20px', width: '100%' }}>
                <h2 style={{ color: '#fff', marginBottom: '5px', fontSize: '1.5rem' }}>
                  {profile.username || 'Anonymous User'}
                </h2>
                {profile.first_name && profile.last_name && (
                  <p style={{ color: '#868686', margin: 0 }}>
                    {profile.first_name} {profile.last_name}
                  </p>
                )}

                {/* Gender */}
                {profile.sex && (
                  <div style={{ 
                    marginTop: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#868686'
                  }}>
                    {profile.sex === 'M' ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="fas fa-mars" style={{ color: '#d11d04' }}></i> Male
                      </span>
                    ) : profile.sex === 'F' ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="fas fa-venus" style={{ color: '#d11d04' }}></i> Female
                      </span>
                    ) : null}
                  </div>
                )}

                {/* YouTube Channel */}
              {profile.youtube_channel && (
  <div style={{ marginTop: '15px' }}>
    <a
      href={profile.youtube_channel}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: '#ff0000',
        textDecoration: 'none',
        padding: '8px 16px',
        background: 'rgba(255, 0, 0, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 0, 0, 0.3)',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = 'rgba(255, 0, 0, 0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'rgba(255, 0, 0, 0.1)';
      }}
    >
      <i className="fab fa-youtube"></i>
      YouTube Channel
    </a>
  </div>
)}


                {/* STATUS */}
                <div
                  style={{
                    marginTop: '15px',
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
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className={styles.rightColumn}>
          {/* ===== STATISTICS ===== */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{totalGames}</div>
              <div className={styles.statLabel}>Favorite Games</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statNumber}>{Object.keys(genresMap).length}</div>
              <div className={styles.statLabel}>Genres</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statNumber}>{topGenre}</div>
              <div className={styles.statLabel}>Top Genre</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                {latestFavorite 
                  ? (latestFavorite.game_name?.length > 15
                      ? latestFavorite.game_name.substring(0, 15) + '...'
                      : latestFavorite.game_name)
                  : 'N/A'}
              </div>
              <div className={styles.statLabel}>Latest Favorite</div>
            </div>
          </div>

          {/* ===== ABOUT YOU ===== */}
          {profile.about && (
            <div className={styles.sectionWidget}>
              <h3 className={styles.alternativeSectionTitle}>
                <i className="fa-solid fa-user"></i>
                <span className='ms-3'>About</span>
              </h3>
              <div className={styles.aboutContainer}>
                <p style={{
                  color: '#fff',
                  lineHeight: '1.6',
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  margin: 0
                }}>
                  {profile.about}
                </p>
              </div>
            </div>
          )}

          {/* ===== TOP GENRES ===== */}
          <div className={styles.sectionWidget}>
            <h3 className={styles.alternativeSectionTitle}>
              <i className="fas fa-star"></i>
              <span className='ms-3'>Favorite Genres</span>
            </h3>
            {genresArray.length === 0 ? (
              <p style={{ color: '#868686', textAlign: 'center', padding: '20px' }}>
                Add favorite games to see favorite genres!
              </p>
            ) : (
              <div className={styles.genresList}>
                {genresArray.map(([genre, count]) => {
                  const maxCount = genresArray[0][1];
                  return (
                    <div key={genre} className={styles.genreItem}>
                      <span className={styles.genreName}>{genre}</span>
                      <span className={styles.genreCount}>{count} games</span>
                      <div className={styles.genreBar}>
                        <div
                          className={styles.genreBarFill}
                          style={{ width: `${(count / maxCount) * 100}%` }}
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

      {/* ===== FAVORITE GAMES ===== */}
      <div className={styles.sectionWidget}>
        <h3 className={styles.alternativeSectionTitle}>
          <i className="fas fa-heart"></i>
          <span className='ms-3'>Favorite Games</span> ({totalGames})
        </h3>

        {favorites.length === 0 ? (
          <p style={{ color: '#868686', textAlign: 'center', padding: '2rem' }}>
            No favorite games yet.
          </p>
        ) : (
          <div className={styles.gamesGrid}>
            {favorites.map((fav) => (
              <Link
                key={fav.id}
                to={`/games/${fav.game_slug}/${fav.game_id}`}
                className={`${styles.gameCard} hasElectricity`}
              >
                <div 
                  className={styles.gameImagePlaceholder}
                  style={{
                    backgroundImage: fav.game_image ? `url(${fav.game_image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                </div>
                <div className={styles.gameName}>{fav.game_name}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}