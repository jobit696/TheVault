import { useState, useEffect } from 'react'

export default function TextSpawner({_array, _showTime, _unshowTime, _infinite = true}) {
   
  const [visibleLetters, setVisibleLetters] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)

  useEffect(() => {
    // timeout animazione
    const startTimer = setTimeout(() => {
      setIsAnimating(true)
    }, 100)

    return () => clearTimeout(startTimer)
  }, [])

  useEffect(() => {
    if (!isAnimating || hasCompleted) return

    const timer = setTimeout(() => {
      if (visibleLetters < _array.length - 1) {
        setVisibleLetters(prev => prev + 1)
      } else {
        // Animazione completata
        if (_infinite) {
          // Modalità infinita: reset e riavvio
          setTimeout(() => {
            setVisibleLetters(-1)
            setIsAnimating(false) 
            
            setTimeout(() => {
              setIsAnimating(true)
            }, 300)
          }, _unshowTime)
        } else {
          // Modalità singola: ferma l'animazione
          setHasCompleted(true)
        }
      }
    }, _showTime)
    
    return () => clearTimeout(timer)
  }, [visibleLetters, _array.length, _showTime, _unshowTime, isAnimating, _infinite, hasCompleted])

  return(
    <>
      <section>
        {
          _array.map((letter, index) => (
            <span 
              key={index}
              style={{ 
                opacity: index <= visibleLetters ? 1 : 0,
                transition: 'opacity 0.4s ease-in'
              }}
            >
              {letter}
            </span>
          ))
        }
      </section>
    </>
  )
}