import { Outlet, useLoaderData } from "react-router";
import Footer from "../components/layout_comp/Footer";
import Header from "../components/layout_comp/Header";
import ParticlesBackground from "../components/layout_comp/ParticlesBackground";

export default function Layout() {
  const bannerGames = useLoaderData(); 
  return (
    <div className="style-layout-system">
      {/* PARTICLES BACKGROUND */}
      <ParticlesBackground />
      
      {/* NAVBAR - BANNER - TITOLO */}
      <Header bannerGames={bannerGames} /> 
      <div className="main-container">
        <Outlet />
      </div>
      {/* FOOTER */}
      <Footer />
    </div>
  );
}