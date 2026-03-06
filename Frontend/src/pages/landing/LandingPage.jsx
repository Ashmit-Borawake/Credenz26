import Experience from "../../components/landing/3DComponents/Experience";
import Menu from "../../components/landing/Menu/Menu";
import Footer from "../../components/shared/Footer";
import Loading from "../../components/landing/Loading/Loading";
import Title from "../../components/landing/Title/Title";
import ToggleControls from "../../components/landing/ToggleControls/ToggleControls";
import TransitionVideo from "../../components/landing/TransitionVideo/TransitionVideo";
import { ASCEND_DESTINATION } from "../../components/landing/3DComponents/Car/Car";
import { useEffect, useState, useCallback } from "react";
import { useModelLoading } from "../../context/ModelLoadingProvider";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const LandingPage = ({ isVisible = true }) => {
  const {
    modelLoaded,
    backgroundModelLoaded,
    hasVisitedLanding,
    markLandingVisited,
  } = useModelLoading();
  const navigate = useNavigate();

  // If returning to landing page, skip loading and intro
  const isReturningVisitor = hasVisitedLanding;

  const [loaded, setLoaded] = useState(isReturningVisitor);
  const [loadingProgress, setLoadingProgress] = useState(
    isReturningVisitor ? 100 : 0,
  );
  const [showContent, setShowContent] = useState(isReturningVisitor);
  const [explore3D, setExplore3D] = useState(false);
  const [ascend, setAscend] = useState(false);
  const [carLoaded, setCarLoaded] = useState(isReturningVisitor);
  const [showTransitionVideo, setShowTransitionVideo] = useState(false);
  const [showBlackFade, setShowBlackFade] = useState(false);

  // Reset explore state when becoming visible again
  useEffect(() => {
    if (isVisible && hasVisitedLanding) {
      setExplore3D(false);
      setAscend(false);
      setShowTransitionVideo(false);
      setShowBlackFade(false);
      // Ensure canvas is visible
      const canvas = document.querySelector(".main-canvas");
      if (canvas) {
        canvas.style.opacity = "1";
      }
    }
  }, [isVisible, hasVisitedLanding]);

  useEffect(() => {
    if (loaded && !isReturningVisitor) {
      modelLoaded.current = true;
      backgroundModelLoaded.current = true;
      setLoadingProgress(100);
    }
  }, [loaded, isReturningVisitor]);

  const handleLoadingComplete = useCallback(() => {
    // Mark that user has visited landing page (for skipping loading on return)
    markLandingVisited();

    // Start camera intro immediately - no gap
    setShowContent(true);

    // Smooth reveal of the main canvas simultaneously
    const canvas = document.querySelector(".main-canvas");
    if (canvas) {
      gsap.fromTo(
        canvas,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
      );
    }
  }, [markLandingVisited]);

  const handleCarAnimationEnd = useCallback(() => {
    // This is called after the car fall is complete (not used for navigation anymore)
    // //console.log('Car animation ended');
  }, []);

  // Triggered after 0.8s of falling - user has seen the fog, now show video
  const handleFallStart = useCallback(() => {
    // //console.log('Triggering black fade');
    setShowBlackFade(true);

    // After fade to black completes, show video
    setTimeout(() => {
      // //console.log('Triggering transition video');
      setShowTransitionVideo(true);
    }, 800); // Match the fade duration
  }, []);

  // Called when video finishes playing
  const handleVideoComplete = useCallback(() => {
    // //console.log('Video complete, navigating to events');
    navigate(ASCEND_DESTINATION);
  }, [navigate]);

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-black">
      {/* Loading Screen */}
      {!showContent && (
        <Loading
          progress={loadingProgress}
          onLoadingComplete={handleLoadingComplete}
          skipTunnel={isReturningVisitor}
        />
      )}

      {/* 3D Experience - pauses when not visible */}
      <Experience
        setLoaded={setLoaded}
        loaded={loaded}
        setLoadingProgress={setLoadingProgress}
        showContent={showContent}
        explore3D={explore3D}
        ascend={ascend}
        onCarAnimationEnd={handleCarAnimationEnd}
        onFallStart={handleFallStart}
        setCarLoaded={setCarLoaded}
        skipIntro={false}
        isVisible={isVisible}
      />

      {/* Fullscreen video transition - plays after falling into fog */}
      <TransitionVideo
        show={showTransitionVideo}
        onComplete={handleVideoComplete}
      />

      {/* Black fade overlay for drive animation end */}
      {showBlackFade && (
        <div
          className="fixed inset-0 bg-black z-[9998]"
          style={{
            animation: "fadeIn 0.8s ease-in forwards",
          }}
        />
      )}

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Title - CREDENZ '26 - hides when in explore or ascend mode */}
        <Title
          visible={showContent && isVisible}
          explore3D={explore3D || ascend}
        />

        {/* Explore & Ascend Toggles - side by side like cred25 */}
        <ToggleControls
          explore3D={explore3D}
          setExplore3D={setExplore3D}
          ascend={ascend}
          setAscend={setAscend}
          carLoaded={carLoaded}
          visible={showContent && isVisible}
        />

        {showContent && isVisible && !explore3D && !ascend && (
          <>
            <Menu />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
