import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Explore mode toggle - styled like cred25
export default function ExploreToggle({ explore3D, setExplore3D, visible = true }) {
  const containerRef = useRef()

  useEffect(() => {
    if (visible && containerRef.current) {
      // Animate in
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power2.out',
          delay: 1.5 // Delay to appear after title
        }
      )
    }
  }, [visible])

  if (!visible) return null

  return (
    <div 
      ref={containerRef}
      className="absolute bottom-32 md:bottom-28 left-1/2 -translate-x-1/2 z-20"
      style={{ opacity: 0 }}
    >
      <div 
        className={`pointer-events-auto transition-all duration-1000 ${
          explore3D ? 'scale-110' : 'scale-100'
        }`}
      >
        <div className="flex flex-col justify-center items-center gap-2">
          {/* Toggle Switch */}
          <button
            onClick={() => setExplore3D(!explore3D)}
            className={`w-14 h-7 rounded-full p-1 flex items-center cursor-pointer transition-all duration-300 ease-in-out ${
              explore3D 
                ? 'bg-red-600 shadow-[0_0_15px_rgba(255,50,0,0.6)]' 
                : 'bg-gray-600/50 hover:bg-gray-500/50'
            }`}
            aria-label="Toggle Explore Mode"
          >
            <span
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                explore3D ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          
          {/* Label */}
          <span 
            className={`text-xl md:text-2xl font-swinging transition-all duration-300 ${
              explore3D 
                ? 'text-red-400 text-glow-red' 
                : 'text-white/80'
            }`}
            style={{
              textShadow: explore3D 
                ? '0 0 10px rgba(255, 50, 0, 0.8), 0 0 20px rgba(255, 50, 0, 0.4)'
                : 'none'
            }}
          >
            Explore
          </span>
        </div>
      </div>
    </div>
  )
}
