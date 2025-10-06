import { useParams, useLoaderData, useNavigate, useSearchParams } from "react-router";
import GenreGameCard from "../../components/cards/GenreGameCard";
import styles from "../../css/GenrePage.module.css";

export default function GenrePage() {
    const { genre } = useParams();
    const data = useLoaderData();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const giochi = data?.results || [];
    const genreName = data?.genreName || 'Games';
    const totalCount = data?.count || 0;
    const page = parseInt(searchParams.get('page') || '1');

    const handlePageChange = (newPage) => {
        navigate(`/genre/${genre}?page=${newPage}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.genrePage}>
             <h2 className={`${styles.genreTitle} ${styles.pageTitle}`}>
                        {genreName} Games
                    </h2>
            <div className="container">
                <div className={styles.genreHeader}>
                   
                    <p className={styles.genreCount}>
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