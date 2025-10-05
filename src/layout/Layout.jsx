import { Outlet, useLoaderData } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ParticlesBackground from "../components/ParticlesBackground";

export default function Layout() {
  const bannerGames = useLoaderData(); 
  return (
    <div className="style-layout-system">
      //particles
      <ParticlesBackground />
      
      <Header bannerGames={bannerGames} /> 
           
      <div className="main-container">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}