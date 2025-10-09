import { useState, useEffect } from 'react'
import './App.css'
import { Routing } from './routes/Routing'
import SessionProvider from './context/SessionProvider'
import ElectricityEffect from './components/effects/ElectricityEffect'
import ParticlesBackground from './components/effects/ParticlesBackground'
import { YoutubeChannelProvider } from './context/YoutubeChannelContext'

function App() {
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