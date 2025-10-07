import { useState, useEffect } from 'react'
import './App.css'
import { Routing } from './routes/Routing'
import SessionProvider from './context/SessionProvider'
import ElectricityEffect from './components/effects/ElectricityEffect'
import ParticlesBackground from './components/effects/ParticlesBackground'

function App() {
  return (
    <>
    <ElectricityEffect />
    <ParticlesBackground/>
    <SessionProvider>
   <Routing/>
   </SessionProvider>
    </>
  )
}
export default App