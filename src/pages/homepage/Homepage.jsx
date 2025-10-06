import ConsoleList from "../../components/lists/ConsoleList";
import CustomGameList from "../../components/lists/CustomGameList";
import GenreList from "../../components/lists/GenreList";
import PopularGameList from "../../components/lists/PopularGameList";
import UpcomingGamesCarousel from "../../components/lists/UpcomingGamesCarousel";
import { useLoaderData } from 'react-router';

function Homepage() {
  const { popularGames, genres } = useLoaderData();


   const upcomingGames = [
        { id: 997551, releaseDate: '2026-03-20' },  // Saros
        { id: 552927, releaseDate: '2026-11-15' }, // Ill
        { id: 1004511, releaseDate: '2026-02-27' }, // RE Requiem
        { id: 1010940, releaseDate: '2026-2-06' }  // NiOh 3
    ];

    return (
        <>


            <PopularGameList games={popularGames} title="- Top 10 -" />
            <GenreList genres={genres} title="- Browse by Genres -" />
            <ConsoleList />
            <CustomGameList 
    title="- Top 10 -" 
    gameIds={[326243, 2551, 452639, 47234, 836449, 9767, 5192, 29143, 10141, 3144]} 
/>
<UpcomingGamesCarousel customGames={upcomingGames} />
        </>
    );
}



export default Homepage;