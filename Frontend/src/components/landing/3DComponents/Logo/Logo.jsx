import { useEffect, useRef, useMemo, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Configure Draco loader for compressed GLB files
// change to host5
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

// Set up GLTF loader with Draco3
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// Calculate responsive X offset based on screen width
const getResponsiveXOffset = () => {
  if (typeof window === 'undefined') return 0;
  const width = window.innerWidth;
  // On smaller screens, push logo left (negative X) aggressively
  if (width < 480) return -10.5;     // Very small mobile
  if (width < 640) return -6.5;     // Small mobile
  if (width < 768) return -2.5;      // Mobile
  if (width < 1024) return -4;     // Tablet
  return 0;                         // Desktop - no offset
};

// Calculate responsive scale based on screen width
// change for vercel
const getResponsiveScale = () => {
  if (typeof window === 'undefined') return 1;
  const width = window.innerWidth;
  // On smaller screens, make logo smaller
  if (width < 400) return 0.65;    // Very small mobile
  if (width < 480) return 0.7;     // Small mobile
  if (width < 640) return 0.8;     // Mobile
  if (width < 768) return 0.9;     // Large mobile
  return 1;                         // Tablet & Desktop - full scale
};

const Logo = ({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) => {
  const { scene, animations } = useGLTF('/models/Logo.glb', true, true, (loader) => {
    loader.setDRACOLoader(dracoLoader)
  })
  const mixer = useRef()
  const [xOffset, setXOffset] = useState(getResponsiveXOffset);
  const [responsiveScaleFactor, setResponsiveScaleFactor] = useState(getResponsiveScale);

  // Listen for resize events to update position and scale
  useEffect(() => {
    const handleResize = () => {
      setXOffset(getResponsiveXOffset());
      setResponsiveScaleFactor(getResponsiveScale());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate final position with responsive offset
  const responsivePosition = useMemo(() => [
    position[0] + xOffset,
    position[1],
    position[2]
  ], [position, xOffset]);

  // Calculate final scale with responsive factor
  const responsiveScale = useMemo(() => {
    if (typeof scale === 'number') {
      return scale * responsiveScaleFactor;
    }
    // If scale is an array [x, y, z]
    return [
      scale[0] * responsiveScaleFactor,
      scale[1] * responsiveScaleFactor,
      scale[2] * responsiveScaleFactor
    ];
  }, [scale, responsiveScaleFactor]);

  // Clone scene to avoid mutation issues on re-render
  const clonedScene = useMemo(() => scene.clone(), [scene])

  // Convert all materials to unlit (MeshBasicMaterial) so scene lighting doesn't affect logo
  useEffect(() => {
    clonedScene.traverse((child) => {
      child.frustumCulled = true

      if (child.isMesh) {
        child.castShadow = false
        child.receiveShadow = false

        // Convert to MeshBasicMaterial to ignore all scene lighting
        const oldMat = child.material
        if (oldMat) {
          const basicMat = new THREE.MeshBasicMaterial({
            map: oldMat.map || null,
            color: oldMat.color ? oldMat.color.clone() : new THREE.Color(0xffffff),
            transparent: oldMat.transparent || false,
            opacity: oldMat.opacity ?? 1,
            side: oldMat.side ?? THREE.FrontSide,
            alphaMap: oldMat.alphaMap || null,
            alphaTest: oldMat.alphaTest || 0,
          })
          // Boost brightness by multiplying color
          basicMat.color.multiplyScalar(2.5)
          child.material = basicMat
        }
      }
    })
  }, [clonedScene])

  // Setup looping animation
  useEffect(() => {
    if (animations && animations.length) {
      mixer.current = new THREE.AnimationMixer(clonedScene)

      // Play all animations in a loop
      animations.forEach((clip) => {
        const action = mixer.current.clipAction(clip)
        action.setLoop(THREE.LoopRepeat, Infinity)
        action.play()
      })
    }

    return () => {
      if (mixer.current) {
        mixer.current.stopAllAction()
      }
    }
  }, [clonedScene, animations])

  // Update animation mixer every frame
  useFrame((_, delta) => {
    if (mixer.current) {
      mixer.current.update(delta)
    }
  })

  return (
    <primitive
      object={clonedScene}
      position={responsivePosition}
      scale={responsiveScale}
      rotation={rotation}
    />
  )
}

// Preload the model with Draco loader
useGLTF.preload('/models/Logo.glb', true, true, (loader) => {
  loader.setDRACOLoader(dracoLoader)
})

export default Logo