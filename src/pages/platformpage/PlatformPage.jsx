import { useParams, useLoaderData, useNavigate, useSearchParams } from "react-router";
import GenreGameCard from "../../components/cards/GenreGameCard";
import styles from "../../css/PlatformPage.module.css";
import { useState } from "react";

export default function PlatformPage() {
    const { platformId } = useParams();
    const data = useLoaderData();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const giochi = data?.results || [];
    const totalCount = data?.count || 0;
    const page = parseInt(searchParams.get('page') || '1');

    // Stati per i filtri
    const [filters, setFilters] = useState({
        genre: searchParams.get('genre') || '',
        ordering: searchParams.get('ordering') || '-rating',
        minRating: searchParams.get('minRating') || ''
    });

    const platformNames = {
        4: 'PC',
        187: 'PLAYSTATION 5',
        186: 'Xbox Series X/S',
        18: 'PlayStation 4',
        1: 'XBOX',
        7: 'NINTENDO SWITCH',
        3: 'Xbox 360',
        16: 'PlayStation 3'
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage);
        navigate(`/platform/${platformId}?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (filterName, value) => {
        const newFilters = { ...filters, [filterName]: value };
        setFilters(newFilters);
        
        // URL con filtri
        const params = new URLSearchParams();
        params.set('page', '1'); // Reset alla pagina 1 quando cambi filtri
        
        Object.entries(newFilters).forEach(([key, val]) => {
            if (val) params.set(key, val);
        });
        
        navigate(`/platform/${platformId}?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilters = () => {
        setFilters({
            genre: '',
            ordering: '-rating',
            minRating: ''
        });
        navigate(`/platform/${platformId}?page=1`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const hasActiveFilters = filters.genre || filters.minRating || filters.ordering !== '-rating';

    return (
        <div className={styles.platformPage}>
            <h2 className={`${styles.platformTitle} ${styles.pageTitle}`}>
                {platformNames[platformId] || 'Platform'} GAMES
            </h2>
            
            <div className="container">
                <div className={styles.platformHeader}>
                    <p className={styles.platformCount}>
                        {totalCount.toLocaleString()} games found
                    </p>
                </div>

                {/* Filtri */}
                <div className={styles.filtersContainer}>
                    <div className={styles.filtersRow}>
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
                
                {/* Griglia giochi o messaggio vuoto */}
                {giochi.length > 0 ? (
                    <div className={styles.gridGamesList}>
                        {giochi.map((game) => (
                            <GenreGameCard key={game.id} game={game} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.noResultsContainer}>
                        <h3 className={styles.noResultsText}>
                            No games found
                        </h3>
                        <p className={styles.noResultsHint}>
                            Try adjusting your filters
                        </p>
                    </div>
                )}

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