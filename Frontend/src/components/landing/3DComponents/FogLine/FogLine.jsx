import { useRef, useMemo } from 'react';
import * as THREE from 'three';

/**
 * FogLine Component - A dense, red fog line for hiding seams
 * 
 * Adjustable Parameters:
 * - position: [x, y, z] - Position of the fog
 * - rotation: [x, y, z] - Rotation in radians
 * - scale: [x, y, z] - Scale of the fog plane
 * - color: hex color - Fog color (default red)
 * - opacity: 0-1 - Fog density/opacity
 * - width: number - Width of the fog line
 * - height: number - Height of the fog line
 * - segments: number - Number of segments for smoother gradients
 */
const FogLine = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#ff0000',
  opacity = 1.0,
  width = 100,
  height = 10,
  segments = 32,
  blending = 'normal', // 'additive', 'normal', 'multiply'
  depthWrite = true,
  visible = true,
  layers = 5,          // Multiple layers for density
  layerSpacing = 0.1,  // Spacing between layers
  softEdges = false,   // Set to true for soft edges, false for solid coverage
}) => {
  const meshRef = useRef();

  // Custom shader for dense fog - can hide what's behind
  const fogMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
        uSoftEdges: { value: softEdges ? 1.0 : 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uSoftEdges;
        varying vec2 vUv;
        
        void main() {
          float alpha = uOpacity;
          
          if (uSoftEdges > 0.5) {
            // Soft edges mode - gradual fade at edges
            float edgeFade = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
            float horizontalFade = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
            alpha = uOpacity * edgeFade * horizontalFade;
          }
          
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: depthWrite,
      blending: blending === 'additive' ? THREE.AdditiveBlending : 
                blending === 'multiply' ? THREE.MultiplyBlending : 
                THREE.NormalBlending,
      side: THREE.DoubleSide,
    });
  }, [color, opacity, blending, depthWrite, softEdges]);

  // Update uniforms when props change
  useMemo(() => {
    if (fogMaterial) {
      fogMaterial.uniforms.uColor.value = new THREE.Color(color);
      fogMaterial.uniforms.uOpacity.value = opacity;
      fogMaterial.uniforms.uSoftEdges.value = softEdges ? 1.0 : 0.0;
    }
  }, [color, opacity, softEdges, fogMaterial]);

  if (!visible) return null;

  // Create multiple layers for dense, opaque fog
  const layerMeshes = [];
  for (let i = 0; i < layers; i++) {
    const zOffset = (i - (layers - 1) / 2) * layerSpacing;
    layerMeshes.push(
      <mesh
        key={i}
        position={[0, 0, zOffset]}
      >
        <planeGeometry args={[width, height, segments, segments]} />
        <primitive object={fogMaterial.clone()} attach="material" />
      </mesh>
    );
  }

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {layerMeshes}
    </group>
  );
};

export default FogLine;
