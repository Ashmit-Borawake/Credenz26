import { useEffect, useRef } from "react";
import gsap from "gsap";

// CREDENZ '26 Title Overlay - Styled like cred25 version
// Disappears with animation when explore or drive mode is active
export default function Title({ visible = true, explore3D = false, ascend = false }) {
  const shouldHide = explore3D || ascend;
  const containerRef = useRef();
  const hasAnimatedIn = useRef(false);

  // Reset animation state when visible changes (e.g., returning from another page)
  useEffect(() => {
    if (visible && !shouldHide) {
      // When becoming visible again, ensure title is shown
      if (hasAnimatedIn.current && containerRef.current) {
        // Already animated before, just make sure it's visible
        gsap.to(containerRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    }
  }, [visible]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (visible && !shouldHide && !hasAnimatedIn.current) {
      // Animate in when visible and not in explore/drive mode
      hasAnimatedIn.current = true;
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: -30,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.3,
        },
      );
    }
  }, [visible, shouldHide]);

  // Handle explore/drive mode transition
  useEffect(() => {
    if (!containerRef.current || !hasAnimatedIn.current) return;

    if (shouldHide) {
      // Animate out - faster and GPU-optimized
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.3,
        y: -30,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      // Animate back in
      gsap.to(containerRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [shouldHide]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="absolute top-20 sm:top-22 md:top-24 left-0 right-0 flex justify-center z-20"
      style={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center">
        {/* Main Title */}
        <div className="flex gap-1 sm:gap-2 items-baseline justify-center whitespace-nowrap">
          <h1
            className="text-[#fff3d4]"
            style={{
            fontFamily: "Stranger Things",
            fontSize: "clamp(1.75rem, 5vw, 3.75rem)", // min 28px, scales with viewport, max 60px
          }}
        >
          CREDENZ
        </h1>
        <span
          className="text-[#ff4400]"
          style={{
            fontFamily: "Stranger Things",
            fontSize: "clamp(1.75rem, 5vw, 3.75rem)",
          }}
        >
          '26
        </span>
      </div>

      {/* Tagline */}
      <p
        className="text-[#fff3d4] tracking-wide text-center px-4"
        style={{
          fontFamily: "Stranger Things",
          fontSize: "clamp(0.875rem, 2.5vw, 1.5rem)", // min 14px, scales, max 24px
        }}
      >
        Warping Realities
      </p>

      {/* Decorative Line */}
      <div
        className="h-0.5 mt-2 mx-auto bg-gradient-to-r from-transparent via-red-600 to-transparent"
        style={{
          boxShadow: "0 0 10px rgba(255, 50, 0, 0.6)",
          width: "clamp(10rem, 30vw, 20rem)", // min 160px, scales, max 320px
        }}
      />
      </div>
    </div>
  );
}
