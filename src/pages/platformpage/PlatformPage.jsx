import { useParams, useLoaderData, useNavigate, useSearchParams } from "react-router";
import GenreGameCard from "../../components/cards/GenreGameCard";
import styles from "../../css/PlatformPage.module.css";

export default function PlatformPage() {
    const { platformId } = useParams();
    const data = useLoaderData();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const giochi = data?.results || [];
    const totalCount = data?.count || 0;
    const page = parseInt(searchParams.get('page') || '1');

    const platformNames = {
        4: 'PC',
        187: 'PlayStation 5',
        186: 'Xbox Series X/S',
        18: 'PlayStation 4',
        1: 'Xbox One',
        7: 'Nintendo Switch',
        3: 'Xbox 360',
        16: 'PlayStation 3'
    };

    const handlePageChange = (newPage) => {
        navigate(`/platform/${platformId}?page=${newPage}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.platformPage}>
            <h2 className={`${styles.platformTitle} ${styles.pageTitle}`}>
                        {platformNames[platformId] || 'Platform'} Games
                    </h2>
            <div className="container">
                <div className={styles.platformHeader}>
                  
                    <p className={styles.platformCount}>
                        {totalCount.toLocaleString()} games found
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