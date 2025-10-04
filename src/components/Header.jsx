import { useContext } from "react";
import SessionContext from "../context/SessionContext";
import GameListBanner from "./GameListBanner"
import GamesStats from "./GamesStats"
import Navbar from "./Navbar"

export default function Header({ bannerGames }) {
    const { session } = useContext(SessionContext);
    
    return(
        <>
         <div style={{ position: 'relative', zIndex: 1000 }}>
        <Navbar />
        <GameListBanner games={bannerGames} />
        <GamesStats />
        </div>
        </>
    )
}