import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// Configure Draco loader for compressed GLB files
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
);

// Route to navigate to after animation ends
export const ASCEND_DESTINATION = "/events";

const Car = ({
  ascend,
  onAnimationEnd,
  onFallStart,
  setCarLoaded,
  cameraInCar,
}) => {
  const { scene } = useGLTF("/models/car.glb", true, true, (loader) => {
    loader.setDRACOLoader(dracoLoader);
  });
  const groupRef = useRef();

  // Animation state
  const isAnimating = useRef(false);
  const animationTime = useRef(0);
  const phase = useRef("idle"); // 'idle', 'driving', 'falling', 'done'
  const fallStartNotified = useRef(false);

  // Starting position
  const startPos = useRef(new THREE.Vector3(-0.6, 0.3786, 13));

  // Notify when car is loaded
  useEffect(() => {
    if (scene) {
      //console.log('Car: Model loaded')
      setCarLoaded?.(true);
    }
  }, [scene, setCarLoaded]);

  // Setup materials and store original opacity
  useEffect(() => {
    scene.traverse((child) => {
      child.frustumCulled = false;
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Store original material properties for transparency control
        if (
          child.material &&
          child.material.userData.originalOpacity === undefined
        ) {
          child.material.userData.originalOpacity =
            child.material.opacity || 1.0;
        }
      }
    });
  }, [scene]);

  // Make car transparent when camera is inside
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const material = child.material;

        if (ascend && cameraInCar) {
          // Camera is inside - make car transparent
          material.transparent = true;
          material.opacity = 1; // Semi-transparent so you can see through
          material.depthWrite = false;
        } else {
          // Camera outside or not driving - make car opaque
          material.transparent = false;
          material.opacity = material.userData.originalOpacity || 1.0;
          material.depthWrite = true;
        }
      }
    });
  }, [ascend, cameraInCar, scene]);

  // Handle ascend (drive) toggle
  useEffect(() => {
    if (ascend && !isAnimating.current) {
      //console.log('Car: Starting drive')
      isAnimating.current = true;
      animationTime.current = 0;
      phase.current = "driving";

      // Reset position
      if (groupRef.current) {
        groupRef.current.position.copy(startPos.current);
        groupRef.current.rotation.set(0, 0, 0);
      }
    }

    if (!ascend) {
      // Reset
      isAnimating.current = false;
      animationTime.current = 0;
      phase.current = "idle";
      fallStartNotified.current = false;
      // host
      if (groupRef.current) {
        groupRef.current.position.copy(startPos.current);
        groupRef.current.rotation.set(0, 0, 0);
      }
    }
  }, [ascend]);

  // Animation loop - -priority 0 (default) ensures car updates before camera (priority 1)
  useFrame((_, delta) => {
    if (!isAnimating.current || !groupRef.current) return;

    // Clamp delta to prevent large jumps on frame drops
    const clampedDelta = Math.min(delta, 0.1);

    animationTime.current += clampedDelta;
    const group = groupRef.current;

    if (phase.current === "driving") {
      // Drive forward over 8 seconds
      const driveDuration = 7;
      const driveDistance = 95;
      const progress = Math.min(animationTime.current / driveDuration, 1);

      // Ease-out only (less aggressive) - maintains more speed at the end
      const eased = 1 - Math.pow(1 - progress, 1.1);

      // Move forward (negative Z)
      group.position.z = startPos.current.z - driveDistance * eased;
      group.position.x = startPos.current.x;
      group.position.y = startPos.current.y;

      if (progress >= 1) {
        //console.log('Car: Entering fall phase')
        phase.current = "falling";
        animationTime.current = 0;
      }
    } else if (phase.current === "falling") {
      // Fall into the portal fog
      const fallDuration = 1.8; // Faster fall
      const fallDepth = 40; // Fall much deeper into the fog
      const progress = Math.min(animationTime.current / fallDuration, 1);

      // Accelerating fall
      const eased = progress * progress;

      // Fall down
      group.position.y = startPos.current.y - fallDepth * eased;

      // Keep moving forward slightly - use clamped delta for consistency
      group.position.z -= clampedDelta * 2;

      // Tilt forward as it falls
      group.rotation.x = -eased * 0.5;

      // After 0.5s of falling, trigger video transition (user sees fog first)
      if (animationTime.current >= 0.5 && !fallStartNotified.current) {
        fallStartNotified.current = true;
        //console.log('Car: Triggering video transition')
        onFallStart?.();
      }

      if (progress >= 1) {
        //console.log('Car: Fall complete')
        phase.current = "done";
        isAnimating.current = false;
        // onAnimationEnd is now called after video completes in LandingPage
      }
    }
  });

  return (
    <group ref={groupRef} position={[-0.6, 0.3786, -3]} name="car-group">
      <primitive object={scene} />
    </group>
  );
};

// Preload with Draco
useGLTF.preload("/models/car.glb", true, true, (loader) => {
  loader.setDRACOLoader(dracoLoader);
});

export default Car;
