import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import styles from "../../css/AllGamesPage.module.css";
import PlatformPageCard from "../../components/cards/PlatformPageCard";

export default function AllGamesPage() {
    const data = useLoaderData();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const giochi = data?.results || [];
    const page = parseInt(searchParams.get('page') || '1');

    const handlePageChange = (newPage) => {
        navigate(`/games?page=${newPage}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.allGamesPage}>
            {/* Hero Section */}
            <div className={styles.heroSection}>
                <LazyLoadImage
                    src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200"
                    alt="All Games"
                    effect="blur"
                    threshold={0}
                    className={styles.heroImage}
                    wrapperProps={{
                        style: {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%'
                        }
                    }}
                />
                
                <div className={styles.heroOverlay}></div>

                <div className={`container pb-5 ${styles.heroContent}`}>
                    <h1 className={styles.heroTitle}>
                        All Games
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Explore our entire gaming collection
                    </p>
                </div>
            </div>

            {/* Games Grid */}
            <div className="container">
                <div className="row g-4">
                    {giochi.map((game) => (
                        <div key={game.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <PlatformPageCard game={game} />
                        </div>
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