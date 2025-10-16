import { useSearchParams, useLoaderData, useNavigate } from "react-router";
import { useState } from "react";
import CardGame from "../../components/cards/CardGame";
import styles from "../../css/SearchPage.module.css";

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const data = useLoaderData();
    const navigate = useNavigate();
    
    const query = searchParams.get('q') || '';
    const games = data?.results || [];
    const totalCount = data?.count || 0;
    
    // Stati per i filtri
    const [filters, setFilters] = useState({
        platform: searchParams.get('platform') || '',
        genre: searchParams.get('genre') || '',
        ordering: searchParams.get('ordering') || '-rating',
        minRating: searchParams.get('minRating') || ''
    });

    const handleFilterChange = (filterName, value) => {
        const newFilters = { ...filters, [filterName]: value };
        setFilters(newFilters);
        
        // Costruisci URL con i nuovi filtri
        const params = new URLSearchParams();
        params.set('q', query); // Mantieni la query di ricerca
        
        Object.entries(newFilters).forEach(([key, val]) => {
            if (val) params.set(key, val);
        });
        
        navigate(`/search?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilters = () => {
        setFilters({
            platform: '',
            genre: '',
            ordering: '-rating',
            minRating: ''
        });
        navigate(`/search?q=${query}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const hasActiveFilters = filters.platform || filters.genre || filters.minRating || filters.ordering !== '-rating';

    return (
        <>
            <h1 className={`${styles.searchResultsTitle} ${styles.pageTitle}`}>
                Search Results: <span className={styles.searchQuery}>{query}</span>
            </h1>
            
            <div className="container mb-5">
                <div className={styles.gamesHeader}>
                    <p className={styles.gamesCount}>
                        {totalCount.toLocaleString()} games found
                    </p>
                </div>

                {/* Filtri - SEMPRE VISIBILI */}
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

                {games.length > 0 ? (
                    <div className="row g-4">
                        {games.map((game) => (
                            <div key={game.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <CardGame game={game} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-12 text-center">
                            <h3 className={styles.noResultsText}>
                                No results found for "{query}"
                            </h3>
                            <p className={styles.noResultsHint}>
                                Try adjusting your filters or search for something else
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}