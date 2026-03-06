import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * TransitionVideo - Fullscreen video overlay for portal transition
 * Covers entire screen including header/footer
 */
const TransitionVideo = ({ show, onComplete }) => {
  const containerRef = useRef();
  const videoRef = useRef();
  const [videoReady, setVideoReady] = useState(false);
  const hasTriggeredComplete = useRef(false);

  // Handle the transition in
  useEffect(() => {
    if (!show || !containerRef.current) return;

    // Fade in from the black screen smoothly
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          // Once visible, play the video
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        },
      }
    );
  }, [show]);

  // Handle video time update - trigger fade-out before end
  const handleTimeUpdate = () => {
    if (!videoRef.current || hasTriggeredComplete.current) return;
    
    const video = videoRef.current;
    const timeRemaining = (video.duration - video.currentTime) * 1000; // in ms
    
    // Start fade-out 800ms before video ends
    if (timeRemaining <= 800) {
      hasTriggeredComplete.current = true;
      
      // Fade out the video container
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          onComplete?.();
        }
      });
    }
  };

  // Reset the trigger flag when show changes
  useEffect(() => {
    if (!show) {
      hasTriggeredComplete.current = false;
    }
  }, [show]);

  // Preload video
  const handleCanPlay = () => {
    setVideoReady(true);
  };

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      style={{ opacity: 0 }}
    >
      <video
        ref={videoRef}
        src="/PISBSHLOK.mp4"
        className="w-full h-full object-cover"
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onCanPlay={handleCanPlay}
        preload="auto"
      />
    </div>
  );
};

export default TransitionVideo;
