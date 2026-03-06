import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { TunnelAnimation } from "../TunnelAnimation/TunnelAnimation";
import Menu from "../Menu/Menu";

const Loading = ({ progress, onLoadingComplete, skipTunnel = false }) => {
  const [phase, setPhase] = useState("loading"); // 'loading' | 'tunnel' | 'done'

  useEffect(() => {
    if (progress >= 100 && phase === "loading") {
      if (skipTunnel) {
        // Skip tunnel animation entirely
        setPhase("done");
        if (onLoadingComplete) onLoadingComplete();
      } else {
        // Wait a bit then start tunnel phase
        setTimeout(() => {
          setPhase("tunnel");

          // Fade out the static loading screen
          gsap.to(".loading-content", {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
          });
        }, 300); // Reduced from 500ms
      }
    }
  }, [progress, phase, skipTunnel, onLoadingComplete]);

  const handleTunnelComplete = () => {
    setPhase("done");
    if (onLoadingComplete) onLoadingComplete();
  };

  if (phase === "done") return null;

  return (
    <div className="loading-container fixed inset-0 z-9999 bg-black">
      {/* Static Loading Phase */}
      {phase === "loading" && (
        <div className="loading-content flex flex-col items-center justify-center h-full">
          <h1
            className="loading-title text-[#ff0000] font-swinging text-5xl md:text-7xl tracking-widest uppercase font-bold mb-16"
            style={{
              fontFamily: "Swinging Wake",
              textShadow:
                "0 0 2px rgba(255,0,0,0.5), 0 0 6px rgba(255,0,0,0.4), 0 0 10px rgba(255,0,0,0.3), 0 0 20px rgba(255,0,0,0.2)",
            }}
          >
            LOADING
          </h1>

          <div
            className="progress-container w-75 md:w-100 h-2 bg-[rgba(255,0,0,0.1)] border-2 border-[#ff0000] rounded overflow-hidden"
            style={{
              boxShadow:
                "0 0 10px rgba(255,0,0,0.5), inset 0 0 10px rgba(0,0,0,0.5)",
            }}
          >
            <div
              className="progress-bar h-full bg-linear-to-r from-[#ff0000] to-[#ff3300] transition-all duration-300"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 20px #ff0000",
              }}
            />
          </div>

          <p
            className="progress-text text-[#ff0000] font-swinging text-2xl mt-5 tracking-wide"
            style={{
              fontFamily: "Stranger Things",
              textShadow: "0 0 10px #ff0000",
            }}
          >
            {Math.floor(progress)}%
          </p>

          <p
            className="loading-subtitle text-[rgba(255,0,0,0.7)] font-swinging text-base mt-10 tracking-widest uppercase"
            style={{
              fontFamily: "Stranger Things",
            }}
          >
            The Upside Down awaits.
          </p>
        </div>
      )}

      {/* Tunnel Animation Phase */}
      {phase === "tunnel" && (
        <TunnelAnimation onComplete={handleTunnelComplete} />
      )}

      <Menu />
    </div>
  );
};

export default Loading;
