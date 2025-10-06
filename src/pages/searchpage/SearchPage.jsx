import { useSearchParams, useLoaderData } from "react-router";
import CardGame from "../../components/cards/CardGame";
import styles from "../../css/SearchPage.module.css";

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const data = useLoaderData();
    
    const query = searchParams.get('q') || '';
    const games = data?.results || [];

    return (
        <>
          <h1 className={`${styles.searchResultsTitle} ${styles.pageTitle}`}>
                        Search Results: <span className={styles.searchQuery}>{query}</span>
                    </h1>
                    <div className="mb-3">.</div>
        <div className="container  my-5">
       

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
                    </div>
                </div>
            )}
        </div>
        </>
    );
}