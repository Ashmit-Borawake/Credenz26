import { useRef, useMemo } from 'react';
import * as THREE from 'three';

/**
 * FogGradient Component - A slanted gradient fog for smooth blending
 * 
 * Creates a fog plane from y=0 to y=height with:
 * - Lower X values slant downward
 * - Higher X values slant upward
 * - Lighter/softer opacity for blending
 */
const FogGradient = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#ff0000',
  opacity = 0.5,           // Lighter for blending
  width = 100,             // X extent
  height = 50,             // Y extent (0 to 50)
  slantAmount = 0.3,       // How much the fog slants (0 = flat, 1 = very slanted)
  segments = 64,
  blending = 'normal',
  visible = true,
}) => {
  const meshRef = useRef();

  // Custom shader for slanted gradient fog
  const fogMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
        uSlantAmount: { value: slantAmount },
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
        uniform float uSlantAmount;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Slant: lower x (uv.x near 0) fades at lower y, higher x (uv.x near 1) fades at higher y
          // This creates a diagonal fade line
          float slantOffset = (vUv.x - 0.5) * uSlantAmount;
          
          // Vertical gradient with slant applied
          // At low x: fade starts earlier (lower y)
          // At high x: fade starts later (higher y)
          float adjustedY = vUv.y - slantOffset;
          
          // Soft gradient from bottom to top
          float verticalFade = smoothstep(0.0, 0.3, adjustedY) * smoothstep(1.0, 0.6, adjustedY);
          
          // Soft horizontal edges
          float horizontalFade = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
          
          float alpha = uOpacity * verticalFade * horizontalFade;
          
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: blending === 'additive' ? THREE.AdditiveBlending : 
                blending === 'multiply' ? THREE.MultiplyBlending : 
                THREE.NormalBlending,
      side: THREE.DoubleSide,
    });
  }, [color, opacity, slantAmount, blending]);

  // Update uniforms when props change
  useMemo(() => {
    if (fogMaterial) {
      fogMaterial.uniforms.uColor.value = new THREE.Color(color);
      fogMaterial.uniforms.uOpacity.value = opacity;
      fogMaterial.uniforms.uSlantAmount.value = slantAmount;
    }
  }, [color, opacity, slantAmount, fogMaterial]);

  if (!visible) return null;

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <planeGeometry args={[width, height, segments, segments]} />
      <primitive object={fogMaterial} attach="material" />
    </mesh>
  );
};

export default FogGradient;
