import { useState, useEffect } from 'react';
import { getAllUsers, banUser, unbanUser } from '../../services/userManagementService';
import styles from '../../css/UserManagement.module.css';
import { Link } from 'react-router';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [banReason, setBanReason] = useState('');
    const [showBanModal, setShowBanModal] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUsersList, setShowUsersList] = useState(false); // ← AGGIUNTO

    
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const allUsers = await getAllUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error('Errore caricamento utenti:', error);
            alert('Error loading users');
        } finally {
            setLoading(false);
        }
    };

    const handleBan = async (userId) => {
        if (!confirm('Ban this user? All their messages will be deleted permanently.')) {
            setShowBanModal(null);
            return;
        }

        setActionLoading(userId);
        try {
            await banUser(userId, banReason);
            alert('User banned successfully');
            setBanReason('');
            setShowBanModal(null);
            await loadUsers();
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleUnban = async (userId) => {
        if (!confirm('Unban this user?')) return;

        setActionLoading(userId);
        try {
            await unbanUser(userId);
            alert('User unbanned successfully');
            await loadUsers();
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter(user => {
        if (!searchQuery.trim()) return true;
        
        const query = searchQuery.toLowerCase();
        const username = (user.username || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        
        return username.includes(query) || email.includes(query);
    });

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className="loader-spinner-large"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className={styles.userManagement}>
            <div className={styles.header}>
                <h4 className={styles.title}>
                    <i className="fas fa-users me-2"></i>
                    User Management
                </h4>
                <div className={styles.headerActions}>
                    <span className={styles.count}>{users.length} users</span>
                    {/* Bottone Toggle */}
                    <button
                        onClick={() => setShowUsersList(!showUsersList)}
                        className={styles.toggleButton}
                    >
                        {showUsersList ? (
                            <>
                                <i className="fas fa-eye-slash me-2"></i>
                                Hide Users
                            </>
                        ) : (
                            <>
                                <i className="fas fa-eye me-2"></i>
                                Show Users
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Mostra solo se showUsersList è true */}
            {showUsersList && (
                <>
                    {/* Campo di ricerca */}
                    <div className={styles.searchContainer}>
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search by username or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className={styles.clearButton}
                                title="Clear search"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>

                    {/* Risultati ricerca */}
                    {searchQuery && (
                        <div className={styles.searchResults}>
                            Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                        </div>
                    )}

                    {/* Lista utenti */}
                    <div className={styles.userList}>
                        {filteredUsers.length === 0 ? (
                            <div className={styles.noResults}>
                                <i className="fas fa-search me-2"></i>
                                No users found matching "{searchQuery}"
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div 
                                    key={user.id} 
                                    className={`${styles.userCard} ${user.isBanned ? styles.banned : ''}`}
                                >
                                    <div className={styles.userInfo}>
                                        <Link 
  to={`/user/${user.id}`}
  className={styles.userNameLink}
>
  <div className={styles.userName}>
    <i className="fas fa-user me-2"></i>
    {user.username || 'No username'}
  </div>
</Link>
                                        <div className={styles.userEmail}>
                                            {user.email}
                                        </div>
                                        {user.isBanned && user.bannedInfo && (
                                            <div className={styles.banInfo}>
                                                <i className="fas fa-ban me-2"></i>
                                                Banned on {new Date(user.bannedInfo.banned_at).toLocaleDateString()}
                                                {user.bannedInfo.reason && (
                                                    <span className={styles.banReason}>
                                                        : {user.bannedInfo.reason}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.actions}>
                                        {user.isBanned ? (
                                            <button
                                                onClick={() => handleUnban(user.id)}
                                                disabled={actionLoading === user.id}
                                                className={`${styles.btn} ${styles.btnUnban}`}
                                            >
                                                {actionLoading === user.id ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Unbanning...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-unlock me-2"></i>
                                                        Unban
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <>
                                                {showBanModal === user.id ? (
                                                    <div className={styles.banModal}>
                                                        <input
                                                            type="text"
                                                            placeholder="Reason (optional)"
                                                            value={banReason}
                                                            onChange={(e) => setBanReason(e.target.value)}
                                                            className={styles.banInput}
                                                        />
                                                        <div className={styles.banModalActions}>
                                                            <button
                                                                onClick={() => handleBan(user.id)}
                                                                disabled={actionLoading === user.id}
                                                                className={`${styles.btn} ${styles.btnConfirmBan}`}
                                                            >
                                                                {actionLoading === user.id ? '⏳' : 'Confirm'}
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setShowBanModal(null);
                                                                    setBanReason('');
                                                                }}
                                                                className={`${styles.btn} ${styles.btnCancel}`}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setShowBanModal(user.id)}
                                                        className={`${styles.btn} ${styles.btnBan}`}
                                                    >
                                                        <i className="fas fa-ban me-2"></i>
                                                        Ban
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}