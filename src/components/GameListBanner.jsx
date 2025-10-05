// GameListBanner.jsx
import SearchBar from './SearchBar.jsx';
import SimpleImageCard from './SimpleImageCard.jsx';
import TextSpawner from './TextSpawner.jsx';

export default function GameListBanner({ games, games_number = 30 }) {
    
    const giochi = games?.results || games || [];

    // Se non ci sono giochi
    if (!giochi.length) {
        return (
            <div className='banner-games-container'>
                <div className="banner-content-wrapper">
                    <h1 className='banner-title'>The Vault</h1>
                    <div className="banner-searchbar-wrapper">
                        <SearchBar/>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='banner-games-container'>
            <div className="banner-content-wrapper">
                <h1 className='banner-title'><TextSpawner _array={['T','h','e',' ','V','a','u','l','t']} _showTime={200} _unshowTime={300} _infinite={false} /></h1>
                <div className="banner-searchbar-wrapper">
                    <SearchBar/>
                </div>
            </div>
            <div className="games-scroll-wrapper">
                {giochi.slice(0, games_number).map(gioco => (
                    <div key={gioco.id} className="game-card-wrapper">
                        <SimpleImageCard url={gioco.background_image}/>
                    </div>
                ))}
                {giochi.slice(0, games_number).map(gioco => (
                    <div key={`${gioco.id}-duplicate`} className="game-card-wrapper">
                        <SimpleImageCard url={gioco.background_image}/>
                    </div>
                ))}
            </div>
        </div>
    );
}