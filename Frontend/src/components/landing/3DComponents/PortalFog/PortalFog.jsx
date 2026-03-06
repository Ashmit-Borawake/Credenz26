import { useRef, useMemo } from 'react';
import * as THREE from 'three';

/**
 * PortalFog Component - A vertical column of gray fog like Stranger Things upside down portal
 * Positioned where the car falls into
 */
const PortalFog = ({
  position = [0, -20, -85],  // Where car falls (end of drive - Z)
  radius = 8,
  height = 60,
  color = '#2a2a2a',         // Gray like Stranger Things
  opacity = 0.7,
  visible = true,
}) => {
  const meshRef = useRef();

  // Custom shader for cylindrical fog with gradient
  const fogMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Vertical gradient - denser at bottom, fading at top
          float verticalFade = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
          
          // Radial fade from center (using UV.x as we're on a cylinder)
          float radialFade = 1.0 - abs(vUv.x - 0.5) * 2.0;
          radialFade = smoothstep(0.0, 0.5, radialFade);
          
          // Add some noise/variation for atmospheric effect
          float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
          float alpha = uOpacity * verticalFade * radialFade * (0.8 + noise * 0.2);
          
          // Slightly vary the gray color
          vec3 finalColor = uColor * (0.9 + noise * 0.2);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
    });
  }, [color, opacity]);

  if (!visible) return null;

  return (
    <group position={position}>
      {/* Main fog cylinder */}
      <mesh ref={meshRef} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[radius, radius * 1.5, height, 32, 16, true]} />
        <primitive object={fogMaterial} attach="material" />
      </mesh>
      
      {/* Inner denser core - much more opaque now */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[radius * 0.6, radius * 0.9, height * 0.85, 16, 8, true]} />
        <meshBasicMaterial 
          color="#1a1a1a" 
          transparent 
          opacity={0.75} 
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Additional dense layer */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[radius * 0.3, radius * 0.5, height * 0.7, 12, 6, true]} />
        <meshBasicMaterial 
          color="#0f0f0f" 
          transparent 
          opacity={0.85} 
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Swirling particles effect using multiple planes - denser */}
      {[...Array(12)].map((_, i) => (
        <mesh 
          key={i} 
          rotation={[0, (Math.PI / 6) * i, 0]}
          position={[0, -height * 0.1, 0]}
        >
          <planeGeometry args={[radius * 2.2, height * 0.9]} />
          <meshBasicMaterial 
            color="#222222"
            transparent 
            opacity={0.25}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

export default PortalFog;
