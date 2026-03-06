import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Generate flare texture exactly like cred25
const generateFlareTexture = () => {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  context.clearRect(0, 0, size, size);

  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );

  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
};

const FireParticles = ({
  position = [0, -1.5, 0],
  planeWidth = 50, // X axis spread
  planeHeight = 50, // Z axis spread (renamed for clarity but kept for compatibility)
  planeDepth = null, // Z axis spread (use this OR planeHeight for Z)
  particleCount = 500,
  particleSize = 0.25,
  height = 20, // Y axis - how high particles travel
  speed = 0.4,
}) => {
  const particles = useRef();

  const flareTexture = useMemo(() => generateFlareTexture(), []);

  // Use planeDepth if provided, otherwise fall back to planeHeight for Z
  const zSpread = planeDepth !== null ? planeDepth : planeHeight;

  const particleGroups = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const opacities = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);
    const spawnDelays = new Float32Array(particleCount); // Staggered spawn times

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * planeWidth;
      // Stagger initial Y positions across the full height for continuous flow
      const y = Math.random() * height;
      const z = (Math.random() - 0.5) * zSpread;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      velocities[i * 3] = (Math.random() - 0.5) * 0.003 * height * speed;
      velocities[i * 3 + 1] = (Math.random() * 0.005 + 0.005) * height * speed;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003 * height * speed;

      // Pure white particles
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;

      // Stagger initial lifetimes so particles are at different stages
      lifetimes[i] = Math.random() * 2; // Random start phase

      // Calculate initial opacity based on height
      const fadeStart = height * 0.4;
      const fadeEnd = height * 0.95;
      let heightFade = 1;
      if (y > fadeStart) {
        heightFade = 1 - (y - fadeStart) / (fadeEnd - fadeStart);
      }
      opacities[i] = Math.max(0, heightFade) * 0.9;
    }

    return { positions, colors, velocities, opacities, lifetimes, zSpread };
  }, [particleCount, planeWidth, zSpread, height, speed]);

  useFrame((state, delta) => {
    const { positions, velocities, opacities, lifetimes } = particleGroups;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      lifetimes[i] += delta * 0.5 * speed;

      // Swirl effect like cred25
      const swirl = Math.sin(lifetimes[i]) * 0.002 * height * speed;
      positions[i * 3] += velocities[i * 3] + swirl;
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2] + swirl;

      // Height-based fade like cred25
      const currentHeight = positions[i * 3 + 1];
      const fadeStart = height * 0.4;
      const fadeEnd = height * 0.95;
      let heightFade = 1;

      if (currentHeight > fadeStart) {
        heightFade = 1 - (currentHeight - fadeStart) / (fadeEnd - fadeStart);
      }

      opacities[i] = Math.max(0, heightFade) * 0.9;

      // Respawn when reaching top or faded out
      if (currentHeight > height || opacities[i] < 0.05) {
        const x = (Math.random() - 0.5) * planeWidth;
        const z = (Math.random() - 0.5) * particleGroups.zSpread;

        positions[i * 3] = x;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = z;

        lifetimes[i] = 0;
      }
    }

    particles.current.geometry.attributes.position.needsUpdate = true;
    particles.current.geometry.attributes.opacity.needsUpdate = true;
  });

  return (
    <points ref={particles} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleGroups.positions.length / 3}
          array={particleGroups.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleGroups.colors.length / 3}
          array={particleGroups.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-opacity"
          count={particleGroups.opacities.length}
          array={particleGroups.opacities}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleSize}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        map={flareTexture}
        opacity={0.8}
      />
    </points>
  );
};

export default FireParticles;
