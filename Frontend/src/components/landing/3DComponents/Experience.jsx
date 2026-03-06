import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

import ResolvedModel from "./ResolvedModel/ResolvedModel";
import Car from "./Car/Car";
import Logo from "./Logo/Logo";
import Loader from "./Loader/Loader";
import CameraIntro, { CAMERA_LOOK_AT } from "../CameraIntro/CameraIntro";
import Sky from "../Environment/Sky";
import FireParticles from "../FireParticles/FireParticles";
import FogLine from "./FogLine/FogLine";
import FogGradient from "./FogLine/FogGradient";
import PortalFog from "./PortalFog/PortalFog";

// Detect mobile once at module level
const isMobile =
  typeof window !== "undefined" &&
  (window.innerWidth < 768 ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

// Home camera position - zoomed in, lower, looking up
const HOME_POSITION = new THREE.Vector3(1, 3, 37);

/* ========================= ASCEND CAMERA CONTROLLER ========================= */
// Camera animates in sync with car using the same animation math
// Animation time starts immediately when ascend is true, transition is just visual
function AscendCameraController({ ascend, onCameraInCar }) {
  const { camera } = useThree();
  const transitionProgress = useRef(0);
  const hasStarted = useRef(false);
  const hasNotifiedInCar = useRef(false);

  // Animation state - mirrors car's animation, starts immediately
  const animationTime = useRef(0);
  const phase = useRef("driving"); // 'driving', 'falling'

  // Car's starting position (must match Car.jsx)
  const carStartPos = useRef(new THREE.Vector3(-0.6, 0.3786, 13));

  // Camera offset from car position
  const cameraOffset = useRef(new THREE.Vector3(-2.6, 1.6, 17.1));
  const lookAtOffset = useRef(new THREE.Vector3(0, 1.0, -16));

  // Camera shake state
  const shakeAmount = useRef(0);

  useFrame((_, delta) => {
    if (!ascend) {
      // Reset when drive is disabled
      if (hasStarted.current) {
        camera.position.copy(HOME_POSITION);
        camera.lookAt(CAMERA_LOOK_AT);
      }
      hasStarted.current = false;
      transitionProgress.current = 0;
      hasNotifiedInCar.current = false;
      animationTime.current = 0;
      phase.current = "driving";
      return;
    }

    // Clamp delta to prevent jumps on frame drops (same as car)
    const clampedDelta = Math.min(delta, 0.1);

    // On first frame, start from HOME_POSITION
    if (!hasStarted.current) {
      hasStarted.current = true;
      camera.position.copy(HOME_POSITION);
      //console.log('Starting camera animation in sync with car');
    }

    // Animation time always advances (same as car)
    animationTime.current += clampedDelta;

    // Calculate camera shake based on animation progress
    const totalTime = animationTime.current;
    if (phase.current === "driving") {
      // Start shake at 5 seconds (near end of 7 second drive)
      if (totalTime > 5.0) {
        const shakeProgress = (totalTime - 5.5) / 2.0; // 0 to 1 over last 2 seconds
        shakeAmount.current = Math.min(shakeProgress * 0.4, 0.4); // Build up to 0.4
      } else {
        shakeAmount.current = 0;
      }
    } else if (phase.current === "falling") {
      // Intense shake during fall
      shakeAmount.current = 0.6;
    }

    // Calculate where the car is based on animation time (same math as Car.jsx)
    let carPos = new THREE.Vector3().copy(carStartPos.current);

    if (phase.current === "driving") {
      const driveDuration = 7;
      const driveDistance = 95;
      const progress = Math.min(animationTime.current / driveDuration, 1);

      // Ease-out only (same as car) - maintains more speed at the end
      const eased = 1 - Math.pow(1 - progress, 1.1);

      // Calculate car position
      carPos.z = carStartPos.current.z - driveDistance * eased;

      if (progress >= 1) {
        phase.current = "falling";
        animationTime.current = 0;
      }
    } else if (phase.current === "falling") {
      const fallDuration = 1.8;
      const fallDepth = 40;
      const driveDistance = 95;
      const progress = Math.min(animationTime.current / fallDuration, 1);

      // Accelerating fall (same as car)
      const eased = progress * progress;

      // Car position at end of drive, continuing to fall
      carPos.z = carStartPos.current.z - driveDistance;
      carPos.z -= clampedDelta * 2; // Keep moving forward slightly
      carPos.y = carStartPos.current.y - fallDepth * eased;
    }

    // Calculate target camera position (where it should be if inside car)
    const targetCamPos = new THREE.Vector3(
      carPos.x + cameraOffset.current.x,
      carPos.y + cameraOffset.current.y,
      carPos.z + cameraOffset.current.z,
    );

    // Camera: FORWARD → left → right → forward
    const time = animationTime.current;
    let rotationAngle;

    if (time < 1.5) {
      // Phase 1: Look FORWARD first (1.5 seconds)
      rotationAngle = 0;
    } else if (time < 3.0) {
      // Phase 2: Smooth turn to left (1.5 seconds) - very smooth easing
      const leftProgress = (time - 1.5) / 1.5;
      // Smooth ease-in-out for gentle start and end
      const eased =
        leftProgress < 0.5
          ? 2 * leftProgress * leftProgress
          : 1 - Math.pow(-2 * leftProgress + 2, 2) / 2;
      rotationAngle = (-eased * Math.PI) / 3; // Turn to left (60 degrees)
    } else if (time < 6.0) {
      // Phase 3: Sweep from left to right (3 seconds)
      const panProgress = (time - 3.0) / 3.0;
      const eased =
        panProgress < 0.5
          ? 2 * panProgress * panProgress
          : 1 - Math.pow(-2 * panProgress + 2, 2) / 2;
      rotationAngle = -Math.PI / 3 + eased * ((2 * Math.PI) / 3); // From left to right
    } else {
      // Phase 4: Smooth turn back to forward (1.5 seconds)
      const forwardProgress = Math.min((time - 6.0) / 1.5, 1);
      const eased = 1 - Math.pow(1 - forwardProgress, 3);
      rotationAngle = Math.PI / 3 - (eased * Math.PI) / 3; // From right back to forward
    }

    const lookRadius = 25; // Wider view

    // Calculate look direction but never look backward
    const lookX = Math.sin(rotationAngle) * lookRadius;
    const lookZ = Math.min(Math.cos(rotationAngle) * lookRadius, 0); // Never look backward (keep Z <= 0)

    const targetLookAt = new THREE.Vector3(
      carPos.x + lookX,
      carPos.y + 1.0, // Fixed height level
      carPos.z + lookZ,
    );

    // Transition: smoothly move camera from HOME to inside car over 1 second
    // But the target position is already moving with the car!
    if (transitionProgress.current < 1) {
      transitionProgress.current += clampedDelta * 1.0;
      transitionProgress.current = Math.min(transitionProgress.current, 1);

      const eased = 1 - Math.pow(1 - transitionProgress.current, 3); // ease-out cubic

      camera.position.lerpVectors(HOME_POSITION, targetCamPos, eased);

      // Apply shake
      if (shakeAmount.current > 0) {
        camera.position.x += (Math.random() - 0.5) * shakeAmount.current;
        camera.position.y += (Math.random() - 0.5) * shakeAmount.current;
      }

      camera.lookAt(targetLookAt);

      if (transitionProgress.current >= 1 && !hasNotifiedInCar.current) {
        hasNotifiedInCar.current = true;
        onCameraInCar?.(true);
        //console.log('Camera transition complete, now locked to car');
      }
    } else {
      // After transition, camera is locked to car position
      camera.position.copy(targetCamPos);

      // Apply shake
      if (shakeAmount.current > 0) {
        camera.position.x += (Math.random() - 0.5) * shakeAmount.current;
        camera.position.y += (Math.random() - 0.5) * shakeAmount.current;
      }

      camera.lookAt(targetLookAt);
    }
  });

  return null;
}

/* ========================= CAMERA CONTROLLER ========================= */
function CameraController({
  explore3D,
  ascend,
  cameraIntroComplete,
  skipIntro,
}) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const isAnimating = useRef(false);
  const hasExploredOnce = useRef(false);

  // Kill GSAP animations on camera when ascend starts to prevent jitter
  useEffect(() => {
    if (ascend) {
      gsap.killTweensOf(camera.position);
    }
  }, [ascend, camera]);

  // Handle explore3D toggle - animate camera position
  useEffect(() => {
    //console.log('CameraController: explore3D changed to', explore3D, 'hasExploredOnce=', hasExploredOnce.current);

    if (!cameraIntroComplete && !skipIntro) {
      //console.log('CameraController: Skipping - intro not complete');
      return;
    }
    if (ascend) {
      //console.log('CameraController: Skipping - ascending');
      return;
    }

    if (explore3D) {
      // User is ENTERING explore mode - do simple lift animation to show freedom
      //console.log('CameraController: Entering explore mode - doing lift animation');
      hasExploredOnce.current = true;
      isAnimating.current = true;

      // Simple lift: move camera up a bit then back down
      gsap.to(camera.position, {
        y: camera.position.y + 3, // Lift up by 3 units
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => {
          camera.lookAt(CAMERA_LOOK_AT);
        },
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    }
  }, [explore3D, cameraIntroComplete, skipIntro, ascend, camera]);

  // Set initial position when skipping intro
  useEffect(() => {
    if (skipIntro) {
      camera.position.copy(HOME_POSITION);
      camera.lookAt(CAMERA_LOOK_AT);
    }
  }, [skipIntro, camera]);

  // Update controls target
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.copy(CAMERA_LOOK_AT);
      controlsRef.current.update();
    }
  }, [explore3D]);

  // Reset OrbitControls when ascend starts to prevent conflicts
  useEffect(() => {
    if (ascend && controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [ascend]);

  // Mouse-based subtle camera movement when not in explore mode (like cred25)
  useFrame((state) => {
    // Allow mouse movement when not exploring/ascending and camera intro is done
    const canDoMouseMove =
      (cameraIntroComplete || skipIntro) &&
      !explore3D &&
      !ascend &&
      !isAnimating.current;
    if (canDoMouseMove) {
      // Subtle movement based on mouse position - use lerp instead of GSAP to avoid conflicts
      const targetX = HOME_POSITION.x + state.pointer.x * 1.5;
      const targetY = HOME_POSITION.y + state.pointer.y * 0.8;

      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.position.z += (HOME_POSITION.z - camera.position.z) * 0.05;
      camera.lookAt(CAMERA_LOOK_AT);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableRotate={explore3D && !ascend}
      enableZoom={explore3D && !ascend}
      enablePan={false}
      enableDamping={!ascend}
      dampingFactor={0.1}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      minDistance={10}
      maxDistance={isMobile ? 40 : 43.5}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={Math.PI / 6}
      target={CAMERA_LOOK_AT}
      enabled={!ascend}
    />
  );
}

/* ========================= LAZY LOADED MODELS ========================= */
// These load after the main scene is ready
function LazyModels({
  ascend,
  onCarAnimationEnd,
  onFallStart,
  setCarLoaded,
  cameraInCar,
}) {
  // When flipping the logo, raise it up by its height (guess: 2.2 units)
  return (
    <>
      <Logo rotation={[0, 0, 0]} position={[3, 4.6, 5]} />
      <Car
        ascend={ascend}
        onAnimationEnd={onCarAnimationEnd}
        onFallStart={onFallStart}
        setCarLoaded={setCarLoaded}
        cameraInCar={cameraInCar}
      />
    </>
  );
}

/* ========================= MAIN EXPERIENCE ========================= */
function Experience({
  setLoaded,
  setLoadingProgress,
  showContent,
  ascend,
  explore3D,
  onCarAnimationEnd,
  onFallStart,
  setCarLoaded,
  skipIntro = false,
  isVisible = true,
}) {
  const [cameraIntroComplete, setCameraIntroComplete] = useState(skipIntro);
  const [mainModelLoaded, setMainModelLoaded] = useState(false);
  const [cameraInCar, setCameraInCar] = useState(false);

  const handleCameraIntroComplete = () => setCameraIntroComplete(true);

  const handleCameraInCar = (isInCar) => {
    setCameraInCar(isInCar);
  };

  // Set camera in car immediately when ascend starts, reset when it ends
  useEffect(() => {
    if (ascend) {
      setCameraInCar(true);
    } else {
      setCameraInCar(false);
    }
  }, [ascend]);

  // When main model loads, trigger the loading complete and start intro
  const handleMainModelLoaded = (loaded) => {
    setMainModelLoaded(loaded);
    setLoaded(loaded);
  };

  // Determine frameloop: 'never' when hidden, 'demand' when loading, 'always' when active
  const frameloop = !isVisible ? "never" : showContent ? "always" : "demand";

  return (
    <Canvas
      className="z-0 main-canvas"
      camera={{
        position: skipIntro
          ? [HOME_POSITION.x, HOME_POSITION.y, HOME_POSITION.z]
          : [10, 30, 20],
        near: 0.1,
        far: 1000,
        fov: 75,
      }}
      gl={{
        antialias: !isMobile,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
        alpha: false,
      }}
      dpr={isMobile ? 1 : [1, 1.5]}
      frameloop={frameloop}
      performance={{ min: 0.5 }}
    >
      <Sky cameraIntroComplete={cameraIntroComplete} />

      {/* ============ FOG LINE - Adjust these values to position ============ */}
      <FogLine
        position={[120, 0, 250]} // [x, y, z] - Move this to hide the seam
        rotation={[0, 0, 1.6]} // [x, y, z] in radians - Rotate to align with seam
        scale={[1, 1, 1]} // [x, y, z] - Scale up/down as needed
        color="#740404" // Red fog color
        opacity={1} // 0-1, 1 = fully opaque/solid
        width={500} // Width of the fog line
        height={300} // Height of the fog line
        blending="normal" // 'normal' for solid coverage, 'additive' for glow
        layers={1} // More layers = denser fog (1-10)
        layerSpacing={0.2} // Spacing between layers
        softEdges={true} // false = solid edges, true = soft fade at edges
        visible={true} // Toggle visibility
      />

      {/* ============ SLANTED FOG GRADIENT - For blending ============ */}
      <FogGradient
        position={[120, 25, 240]} // Same X/Z as FogLine, Y at center of 0-50 range
        rotation={[0, 0, 0]} // Match FogLine rotation
        scale={[1, 1, 1]}
        color="#a21515" // Same red as FogLine
        opacity={0.4} // Lighter for blending
        width={350} // Match FogLine width
        height={100} // From y=0 to y=50
        slantAmount={0.5} // Slant intensity (lower X down, higher X up)
        blending="normal" // 'normal' or 'additive'
        visible={true}
      />
      {/* ============================================================= */}

      {/* Portal fog column where car falls - Stranger Things style */}
      <PortalFog
        position={[-0.6, -27, -64]} // Below the portal, Z stays negative
        radius={20} // Much thicker
        height={60}
        color="#2a2a2a" // Gray like upside down
        opacity={1.0} // Full density
        visible={true}
      />
      {/* ================================================================== */}

      <CameraIntro
        enabled={showContent && !skipIntro}
        onComplete={handleCameraIntroComplete}
      />

      {/* Primary model - loads first with loading screen */}
      <Suspense
        fallback={
          <Loader
            setLoaded={setLoaded}
            setLoadingProgress={setLoadingProgress}
          />
        }
      >
        <ResolvedModel setLoaded={handleMainModelLoaded} />
      </Suspense>

      {/* Secondary models - lazy load after main model is ready */}
      {mainModelLoaded && (
        <Suspense fallback={null}>
          <LazyModels
            ascend={ascend}
            onCarAnimationEnd={onCarAnimationEnd}
            onFallStart={onFallStart}
            setCarLoaded={setCarLoaded}
            cameraInCar={cameraInCar}
          />
        </Suspense>
      )}

      {/* Fire particles */}
      <FireParticles
        position={[0, -1.5, 0]}
        planeWidth={90} // X axis spread
        planeDepth={90} // Z axis spread (independent from X)
        height={50} // Y axis - how high they travel
        particleCount={isMobile ? 200 : 500}
        particleSize={0.5}
        speed={0.15}
      />

      {/* Ascend camera controller - follows car during drive */}
      <AscendCameraController
        ascend={ascend}
        onCameraInCar={handleCameraInCar}
      />

      {/* Camera controller - handles explore mode and mouse movement */}
      <CameraController
        explore3D={explore3D}
        ascend={ascend}
        cameraIntroComplete={cameraIntroComplete}
        skipIntro={skipIntro}
      />
    </Canvas>
  );
}

export default Experience;
