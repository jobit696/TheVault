import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import GenreGameCard from "../../components/cards/GenreGameCard";
import styles from "../../css/AllGamesPage.module.css";
import { useState, useEffect } from "react";

export default function AllGamesPage() {
    const data = useLoaderData();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const giochi = data?.results || [];
    const totalCount = data?.count || 0;
    const page = parseInt(searchParams.get('page') || '1');
    
    // Stati per i filtri
    const [filters, setFilters] = useState({
        platform: searchParams.get('platform') || '',
        genre: searchParams.get('genre') || '',
        ordering: searchParams.get('ordering') || '-rating',
        minRating: searchParams.get('minRating') || ''
    });

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage);
        navigate(`/games?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (filterName, value) => {
        const newFilters = { ...filters, [filterName]: value };
        setFilters(newFilters);
        
        // Costruisci URL con i nuovi filtri
        const params = new URLSearchParams();
        params.set('page', '1'); // Reset alla pagina 1 quando cambi filtri
        
        Object.entries(newFilters).forEach(([key, val]) => {
            if (val) params.set(key, val);
        });
        
        navigate(`/games?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilters = () => {
        setFilters({
            platform: '',
            genre: '',
            ordering: '-rating',
            minRating: ''
        });
        navigate('/games?page=1');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const hasActiveFilters = filters.platform || filters.genre || filters.minRating || filters.ordering !== '-rating';

    return (
        <div className={styles.allGamesPage}>
            <h2 className={`${styles.gamesTitle} ${styles.pageTitle}`}>
                All Games
            </h2>
            
            <div className="container">
                <div className={styles.gamesHeader}>
                    <p className={styles.gamesCount}>
                        {totalCount.toLocaleString()} games available
                    </p>
                </div>

                {/* Filtri */}
                <div className={styles.filtersContainer}>
                    <div className={styles.filtersRow}>
                        {/* Piattaforma */}
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>
                                <i className="fas fa-gamepad"></i> Platform
                            </label>
                            <select 
                                className={styles.filterSelect}
                                value={filters.platform}
                                onChange={(e) => handleFilterChange('platform', e.target.value)}
                            >
                                <option value="">All Platforms</option>
                                <option value="4">PC</option>
                                <option value="187">PlayStation 5</option>
                                <option value="18">PlayStation 4</option>
                                <option value="1">Xbox One</option>
                                <option value="186">Xbox Series X/S</option>
                                <option value="7">Nintendo Switch</option>
                                <option value="3">Xbox 360</option>
                                <option value="16">PlayStation 3</option>
                            </select>
                        </div>

                        {/* Genere */}
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>
                                <i className="fas fa-tag"></i> Genre
                            </label>
                            <select 
                                className={styles.filterSelect}
                                value={filters.genre}
                                onChange={(e) => handleFilterChange('genre', e.target.value)}
                            >
                                <option value="">All Genres</option>
                                <option value="4">Action</option>
                                <option value="51">Indie</option>
                                <option value="3">Adventure</option>
                                <option value="5">RPG</option>
                                <option value="10">Strategy</option>
                                <option value="2">Shooter</option>
                                <option value="40">Casual</option>
                                <option value="14">Simulation</option>
                                <option value="7">Puzzle</option>
                                <option value="11">Arcade</option>
                                <option value="83">Platformer</option>
                                <option value="1">Racing</option>
                                <option value="59">Massively Multiplayer</option>
                                <option value="15">Sports</option>
                                <option value="6">Fighting</option>
                            </select>
                        </div>

                        {/* Ordinamento */}
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>
                                <i className="fas fa-sort"></i> Sort By
                            </label>
                            <select 
                                className={styles.filterSelect}
                                value={filters.ordering}
                                onChange={(e) => handleFilterChange('ordering', e.target.value)}
                            >
                                <option value="-rating">Top Rated</option>
                                <option value="-released">Newest First</option>
                                <option value="released">Oldest First</option>
                                <option value="name">Name (A-Z)</option>
                                <option value="-name">Name (Z-A)</option>
                                <option value="-metacritic">Metacritic Score</option>
                                <option value="-added">Most Popular</option>
                            </select>
                        </div>

                        {/* Rating Minimo */}
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>
                                <i className="fas fa-star"></i> Min Rating
                            </label>
                            <select 
                                className={styles.filterSelect}
                                value={filters.minRating}
                                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                            >
                                <option value="">Any Rating</option>
                                <option value="90">Masterpiece</option>
                                <option value="80">Great</option>
                                <option value="70">Good</option>
                                <option value="60">Decent</option>
                            </select>
                        </div>
                    </div>

                    {/* Pulsante Clear Filters */}
                    {hasActiveFilters && (
                        <div className={styles.clearFiltersContainer}>
                            <button 
                                className={styles.clearFiltersBtn}
                                onClick={clearFilters}
                            >
                                <i className="fas fa-times-circle me-2"></i>
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
                
                <div className={styles.gridGamesList}>
                    {giochi.map((game) => (
                        <GenreGameCard key={game.id} game={game} />
                    ))}
                </div>

                {/* Pagination */}
                {giochi.length > 0 && (
                    <div className="d-flex justify-content-center align-items-center gap-3 my-5">
                        <button 
                            className={`btn btn-secondary btn-lg ${styles.pagination}`}
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                        >
                            <i className="fas fa-chevron-left me-2"></i>
                            Previous
                        </button>
                        <span className={styles.pageNumber}>
                            Page {page}
                        </span>
                        <button 
                            className={`btn btn-secondary btn-lg ${styles.pagination}`}
                            onClick={() => handlePageChange(page + 1)}
                            disabled={giochi.length < 20}
                        >
                            Next
                            <i className="fas fa-chevron-right ms-2"></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}