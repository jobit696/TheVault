import { createBrowserRouter, RouterProvider } from "react-router";
import Homepage from '../pages/homepage/Homepage';
import Errorpage from "../pages/errors/Errorpage";
import Layout from "../layout/Layout";
import GamePage from "../pages/gamepage/GamePage";
import GenrePage from "../pages/genrepage/GenrePage";
import PlatformPage from "../pages/platformpage/PlatformPage";
import SearchPage from "../pages/searchpage/SearchPage";
import RegisterPage from "../pages/register/RegisterPage";
import AllGamesPage from "../pages/allgamespage/AllGamesPage";
import AccountPage from "../pages/account/AccountPage";
import {
  getAllGames,
  getGamesByPlatform,
  getGameDetails,
  getGamesByGenre,
  getGamesBySearch,
  getHomepageData,
  getLayoutData
} from "../functions/loaders";
import LoginPage from "../pages/login/LoginPage";
import ArcadePage from "../pages/arcadepage/ArcadePage";
import CommunityGamePage from "../pages/communitygamepage/CommunityGamePage";


const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    loader: getLayoutData, 
    errorElement: <Errorpage />,
    children: [
      {
       path: "/",
  Component: Homepage,
  loader: getHomepageData
      },
      {
        path: "/games",
        Component: AllGamesPage,
        loader: getAllGames
      },
      {
        path: "/genre/:genre",
        Component: GenrePage,
        loader: getGamesByGenre
      },
      {
        path: "/games/:slug/:id",
        Component: GamePage,
        loader: getGameDetails
      },
      {
        path: "/platform/:platformId",
        Component: PlatformPage,
        loader: getGamesByPlatform
      },
      {
        path: "/search",
        Component: SearchPage,
        loader: getGamesBySearch
      },
      {
        path: "/register",
        Component: RegisterPage
      },
      {
        path: "/login",
        Component: LoginPage
      },
      {
        path: "/account",
        Component: AccountPage
      },
      {
        path: "*",
        Component: Errorpage 
      },
      {
    path: '/arcade',
    Component: ArcadePage 
}
,
      {
    path: '/communitygamepage',
    Component: CommunityGamePage 
}
    ]
  }
]);



export function Routing() {
  return <RouterProvider router={router} />;
}