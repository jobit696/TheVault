import { useParams, useLoaderData, useNavigate, useSearchParams } from "react-router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import styles from "../../css/PlatformPage.module.css";
import PlatformPageCard from "../../components/cards/PlatformPageCard";
import xboxgamebanner from '../../assets/images/platform_images/xboxgamebanner.jpg';
import ps5gamebanner from '../../assets/images/platform_images/ps5gamebanner.jpg';
import switchgamebanner from '../../assets/images/platform_images/switchgamebanner.jpg';
import pcgamebanner from '../../assets/images/platform_images/pcgamebanner.jpg';

export default function PlatformPage() {
    const { platformId } = useParams();
    const data = useLoaderData();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const giochi = data?.results || [];
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

    const platformImages = {
        4: pcgamebanner,
        187: ps5gamebanner,
        186: xboxgamebanner,
        18: ps5gamebanner,
        1: xboxgamebanner,
        7: switchgamebanner
    };

    const handlePageChange = (newPage) => {
        navigate(`/platform/${platformId}?page=${newPage}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.platformPage}>
            {/* Hero Section */}
            <div className={styles.heroSection}>
                <LazyLoadImage
                    src={platformImages[platformId] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200'}
                    alt={platformNames[platformId]}
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
                        {platformNames[platformId] || 'Platform'} Games
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Explore the best games for {platformNames[platformId]}
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