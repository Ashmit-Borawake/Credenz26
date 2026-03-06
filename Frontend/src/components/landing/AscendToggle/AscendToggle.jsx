import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const AscendToggle = ({ isActive, onClick, disabled }) => {
  const buttonRef = useRef(null)

  useEffect(() => {
    // Entry animation
    gsap.from(buttonRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.5
    })
  }, [])

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3
        rounded-full
        font-['Minecraft']
        text-lg
        tracking-wider
        uppercase
        transition-all
        duration-300
        ${isActive 
          ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(255,50,50,0.7)] border-2 border-red-400' 
          : 'bg-black/50 text-red-400 border-2 border-red-600 hover:bg-red-900/50 hover:shadow-[0_0_20px_rgba(255,50,50,0.4)]'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        backdrop-blur-sm
      `}
    >
      {isActive ? 'Driving...' : 'Drive'}
    </button>
  )
}

export default AscendToggle
