import '@fontsource/orbitron/900.css'; 
import '@fontsource/orbitron/700.css';
import '@fontsource/rajdhani/400.css'; 
import '@fontsource/rajdhani/500.css'; 
import '@fontsource/rajdhani/600.css'; 
import '@fontsource/rajdhani/700.css'; 

import { useState, useEffect } from 'react'
import './App.css'
import TextSpawner from './components/TextSpawner'
import { Routing } from './routes/Routing'
import SessionProvider from './context/SessionProvider'

function App() {
  const [count, setCount] = useState(0)


 

  return (
    <>
    <SessionProvider>
   <Routing/>
   </SessionProvider>
    </>
  )
}

export default App