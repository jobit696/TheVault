import { useState, useEffect } from 'react'
import './App.css'
import { Routing } from './routes/Routing'
import SessionProvider from './context/SessionProvider'
import ElectricityEffect from './components/effects/ElectricityEffect'

function App() {



 

  return (
    <>
    <ElectricityEffect />
    <SessionProvider>
   <Routing/>
   </SessionProvider>
    </>
  )
}

export default App