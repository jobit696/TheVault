import { useState, useEffect } from 'react'
import './App.css'
import { Routing } from './routes/Routing'
import SessionProvider from './context/SessionProvider'
import ElectricityEffect from './components/effects/ElectricityEffect'
import ParticlesBackground from './components/effects/ParticlesBackground'
import { YoutubeChannelProvider } from './context/YoutubeChannelContext'
import ScrollToTop from './components/layout_comp/ScrollToTop'
import { trackVisit } from './services/siteStatsService'

function App() {

useEffect(() => {
    // aggiungi visita quando si apre app
    trackVisit();
  }, []); 




  return (
    <>
    <ElectricityEffect />
    <ParticlesBackground/>
    <SessionProvider>
      <YoutubeChannelProvider>
        
   <Routing/>
   </YoutubeChannelProvider>
   </SessionProvider>
    </>
  )
}
export default App