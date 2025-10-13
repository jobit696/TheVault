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
import ScrollToTop from "../components/layout_comp/ScrollToTop";
import UserProfilePage from '../pages/account/UserProfilePage';
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
    element: ( // ← CAMBIATO da Component a element
      <>
        <ScrollToTop /> {/* ← AGGIUNTO */}
        <Layout />
      </>
    ),
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
        path: "/arcade",
        Component: ArcadePage 
      },
      {
path: "/user/:userId",
Component: UserProfilePage

      },
      {
        path: '/communitygamepage',
        Component: CommunityGamePage 
      },
      {
        path: "*",
        Component: Errorpage 
      }
    ]
  }
]);

export function Routing() {
  return <RouterProvider router={router} />;
}