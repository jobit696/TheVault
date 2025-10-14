import { useEffect } from 'react'
import './App.css'
import { Routing } from './routes/Routing'
import SessionProvider from './context/SessionProvider'
import ElectricityEffect from './components/effects/ElectricityEffect'
import ParticlesBackground from './components/effects/ParticlesBackground'
import { YoutubeChannelProvider } from './context/YoutubeChannelContext'
import ScrollToTop from './components/layout_comp/ScrollToTop'
import { trackVisit } from './services/siteStatsService'
import { AdminProvider } from './context/AdminContext'
import EmailConfirmationHandler from './components/auth/EmailConfirmationHandler'

function App() {

  useEffect(() => {
    // Aggiungi visita quando si apre app
    trackVisit();
  }, []);

  return (
    <>
      <ElectricityEffect />
      <ParticlesBackground />
      <EmailConfirmationHandler />
      
      <SessionProvider>
        <AdminProvider>
          <YoutubeChannelProvider>
            <Routing />
          </YoutubeChannelProvider>
        </AdminProvider>
      </SessionProvider>
    </>
  )
}

export default App