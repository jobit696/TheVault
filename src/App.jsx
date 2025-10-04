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