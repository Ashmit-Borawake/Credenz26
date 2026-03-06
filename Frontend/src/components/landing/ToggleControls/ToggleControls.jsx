import { useEffect, useRef } from "react";
import gsap from "gsap";

// Combined Explore and Ascend toggles - styled like cred25 LandingPageComponents
export default function ToggleControls({
  explore3D,
  setExplore3D,
  ascend,
  setAscend,
  carLoaded,
  visible = true,
}) {
  const containerRef = useRef();

  // Determine active toggle
  const activeToggle = explore3D ? "explore3D" : ascend ? "ascend" : null;

  const handleToggle = (toggle) => {
    if (toggle === "explore3D") {
      setExplore3D(!explore3D);
      if (ascend) setAscend(false);
    } else if (toggle === "ascend" && carLoaded) {
      setAscend(!ascend);
      if (explore3D) setExplore3D(false);
    }
  };

  useEffect(() => {
    if (visible && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 1.5,
        },
      );
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="absolute bottom-32 md:bottom-24 left-1/2 -translate-x-1/2 z-20 scale-75 md:scale-100 origin-bottom"
      style={{ opacity: 0 }}
    >
      <div className="flex gap-8 md:gap-12 items-end">
        {/* Explore Toggle */}
        <div
          className={`pointer-events-auto transition-all duration-500 ${activeToggle && activeToggle !== "explore3D"
              ? "scale-75 opacity-30"
              : "scale-100 opacity-100"
            }`}
        >
          <div className="flex flex-col justify-center items-center gap-2">
            <button
              onClick={() => handleToggle("explore3D")}
              disabled={activeToggle === "ascend"}
              className={`w-14 h-7 rounded-full p-1 flex items-center cursor-pointer transition-all duration-300 ease-in-out ${explore3D
                  ? "bg-red-600 shadow-[0_0_15px_rgba(255,50,0,0.6)]"
                  : "bg-gray-600/50 hover:bg-gray-500/50"
                } ${activeToggle === "ascend" ? "cursor-not-allowed opacity-50" : ""}`}
              aria-label="Toggle Explore Mode"
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${explore3D ? "translate-x-7" : "translate-x-0"
                  }`}
              />
            </button>
            <span
              className={`text-xl md:text-2xl font-swinging transition-all duration-300 ${explore3D ? "text-red-400" : "text-white/80"
                }`}
              style={{
                fontFamily: "Stranger Things",
                textShadow: explore3D
                  ? "0 0 5px rgba(255, 50, 0, 0.8), 0 0 5px rgba(255, 50, 0, 0.4)"
                  : "none",
              }}
            >
              Explore
            </span>
          </div>
        </div>

        {/* Ascend Toggle */}
        <div
          className={`pointer-events-auto transition-all duration-500 ${activeToggle && activeToggle !== "ascend"
              ? "scale-75 opacity-30"
              : "scale-100 opacity-100"
            }`}
        >
          <div className="flex flex-col justify-center items-center gap-2">
            <button
              onClick={() => handleToggle("ascend")}
              disabled={activeToggle === "explore3D" || !carLoaded}
              className={`w-14 h-7 rounded-full p-1 flex items-center cursor-pointer transition-all duration-300 ease-in-out ${ascend
                  ? "bg-red-600 shadow-[0_0_15px_rgba(255,50,0,0.6)]"
                  : "bg-gray-600/50 hover:bg-gray-500/50"
                } ${activeToggle === "explore3D" || !carLoaded ? "cursor-not-allowed opacity-50" : ""}`}
              aria-label="Toggle Ascend Mode"
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${ascend ? "translate-x-7" : "translate-x-0"
                  }`}
              />
            </button>
            <span
              className={`text-xl md:text-2xl font-swinging transition-all duration-300 ${ascend
                  ? "text-red-400"
                  : carLoaded
                    ? "text-white/80"
                    : "text-white/40"
                }`}
              style={{
                fontFamily: "Stranger Things",
                textShadow: ascend
                  ? "0 0 5px rgba(255, 50, 0, 0.8), 0 0 5px rgba(255, 50, 0, 0.4)"
                  : "none",
              }}
            >
              {carLoaded ? "Drive" : "wait..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
