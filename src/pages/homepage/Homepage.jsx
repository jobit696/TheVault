import ConsoleList from "../../components/lists/ConsoleList";
import CustomGameList from "../../components/lists/CustomGameList";
import GenreList from "../../components/lists/GenreList";
import NewGameList from "../../components/lists/NewGameList";
import UpcomingGamesCarousel from "../../components/lists/UpcomingGamesCarousel";
import { useLoaderData } from 'react-router';

function Homepage() {
  const { popularGames, genres } = useLoaderData();


  

    return (
        <>


            <NewGameList games={popularGames} title="- Top 10 -" />
            <GenreList genres={genres} title="- Browse by Genres -" />
            <ConsoleList />
            <CustomGameList 
    title="- Top 10 -" 
    gameIds={[326243, 2551, 452639, 47234, 836449, 9767, 5192, 29143, 10141, 3144]} 
/>
            <UpcomingGamesCarousel />
        </>
    );
}



export default Homepage;