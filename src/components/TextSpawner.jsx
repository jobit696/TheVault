import { useState, useEffect } from 'react'

export default function TextSpawner({_array, _showTime, _unshowTime}) {
   
  const [visibleLetters, setVisibleLetters] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // timeout animazione
    const startTimer = setTimeout(() => {
      setIsAnimating(true)
    }, 100)

    return () => clearTimeout(startTimer)
  }, [])

  useEffect(() => {
    if (!isAnimating) return

    const timer = setTimeout(() => {
      if (visibleLetters < _array.length - 1) {
        setVisibleLetters(prev => prev + 1)
      } else {
        setTimeout(() => {
          setVisibleLetters(-1)
          setIsAnimating(false) 
          
          // Riavvio
          setTimeout(() => {
            setIsAnimating(true)
          }, 300)
        }, _unshowTime) 
      }
    }, _showTime)
    
    return () => clearTimeout(timer)
  }, [visibleLetters, _array.length, _showTime, _unshowTime, isAnimating])

  return(
    <>
   <section>
      {
        _array.map((letter, index) => (
          <span 
            key={index}
            style={{ 
              opacity: index <= visibleLetters ? 1 : 0,
              transition: 'opacity 0.4s ease-in',
              fontSize: '2rem',
              margin: '0 2px'
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