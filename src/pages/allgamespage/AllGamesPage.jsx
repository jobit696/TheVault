import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import GenreGameCard from "../../components/cards/GenreGameCard";
import styles from "../../css/AllGamesPage.module.css";

export default function AllGamesPage() {
    const data = useLoaderData();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const giochi = data?.results || [];
    const totalCount = data?.count || 0;
    const page = parseInt(searchParams.get('page') || '1');

    const handlePageChange = (newPage) => {
        navigate(`/games?page=${newPage}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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