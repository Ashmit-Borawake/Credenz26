import { useRef, useEffect, Suspense, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Detect mobile for performance adjustments2
const isMobile = typeof window !== 'undefined' && (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
  window.innerWidth < 768
);

// Shared geometry for all cloud layers - created once
const sharedCloudGeometry = new THREE.SphereGeometry(450, isMobile ? 16 : 24, isMobile ? 16 : 24);

// Texture-based cloud sphere - only texture2 (closest, most visible layer)
function TexturedCloudLayers() {
  const { camera, scene } = useThree()
  const cloudLayer = useRef(null)
  const frameCount = useRef(0)

  // Only load texture2 - the closest and most prominent layer
  const [texture2] = useTexture(['/textures/vecteezy_rain-clouds-and-black-sky-textured-background_10121810_444-min.jpg'])

  useEffect(() => {
    if (!texture2) return;
    
    // Configure texture
    texture2.colorSpace = THREE.SRGBColorSpace
    texture2.minFilter = THREE.LinearMipMapLinearFilter
    texture2.magFilter = THREE.LinearFilter
    texture2.anisotropy = isMobile ? 1 : 2
    texture2.wrapS = THREE.MirroredRepeatWrapping
    texture2.wrapT = THREE.ClampToEdgeWrapping

    // Single cloud layer - the closest one (scale 0.94)
    const mat = new THREE.MeshBasicMaterial({
      map: texture2,
      side: THREE.BackSide,
      transparent: false,
      opacity: 0.75,
      depthWrite: true,
      color: new THREE.Color('#842b2b'),
      toneMapped: true,
      fog: false
    })
    
    const mesh = new THREE.Mesh(sharedCloudGeometry, mat)
    mesh.scale.setScalar(0.94)
    mesh.rotation.y = 0.57 * Math.PI
    mesh.renderOrder = -999
    cloudLayer.current = mesh
    scene.add(mesh)

    return () => {
      if (cloudLayer.current) {
        scene.remove(mesh)
        mat.dispose()
      }
    }
  }, [scene, texture2])

  useFrame(() => {
    // Throttle to every 3rd frame
    frameCount.current++
    if (frameCount.current % 3 !== 0) return
    if (!cloudLayer.current) return
    
    cloudLayer.current.position.copy(camera.position)
    cloudLayer.current.rotation.y += 0.00004 * 3
    cloudLayer.current.rotation.x += 0.00004 * 0.9
  })

  return null
}

// Optimized Shader-based background sky - simplified noise function
function ShaderSky() {
  const mesh = useRef()
  const { camera } = useThree()
  const frameCount = useRef(0)

  useFrame(({ clock }) => {
    if (!mesh.current) return
    
    // Throttle to every 4th frame
    frameCount.current++
    if (frameCount.current % 4 !== 0) return
    
    mesh.current.position.copy(camera.position)
    mesh.current.material.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <mesh ref={mesh} renderOrder={-1000}>
      <sphereGeometry args={[800, isMobile ? 12 : 16, isMobile ? 12 : 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
        }}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          uniform float uTime;

          // Simplified hash - fewer operations
          float hash(vec3 p) {
            return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
          }

          // Simplified noise - no interpolation, just hash
          float noise(vec3 p) {
            vec3 i = floor(p);
            return hash(i);
          }

          // Reduced fbm - only 2 octaves instead of 3
          float fbm(vec3 p) {
            return noise(p * 0.5) * 0.6 + noise(p * 1.0) * 0.4;
          }

          void main() {
            vec3 dir = normalize(vNormal);
            vec3 p = dir * 3.0;
            p.y += uTime * 0.01;

            float clouds = fbm(p);
            float height = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);

            vec3 veryDark = vec3(0.08, 0.01, 0.01);
            vec3 darkRed = vec3(0.25, 0.05, 0.04);

            vec3 color = mix(veryDark, darkRed, height);
            color = mix(color, darkRed * 1.8, clouds * 0.5);

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  )
}

// Storm fog particles - reduced count
// Flickering signboard lights component
function FlickeringSignboardLights({ cameraIntroComplete }) {
  const light1Ref = useRef()
  const light2Ref = useRef()
  const [animationStarted, setAnimationStarted] = useState(false)
  const animationTime = useRef(0)
  const flickerPhase = useRef('waiting') // 'waiting', 'flickering', 'normal'

  useEffect(() => {
    if (cameraIntroComplete && !animationStarted) {
      setAnimationStarted(true)
      flickerPhase.current = 'flickering'
      animationTime.current = 0
    }
  }, [cameraIntroComplete, animationStarted])

  useFrame((_, delta) => {
    if (!light1Ref.current || !light2Ref.current) return
    if (!animationStarted) return

    animationTime.current += delta

    if (flickerPhase.current === 'flickering') {
      // Flicker for 2 seconds
      if (animationTime.current < 2) {
        // Random flickering effect
        const flicker = Math.random() > 0.5 ? 1 : 0.3
        light1Ref.current.intensity = 50 * flicker
        light2Ref.current.intensity = 100 * flicker
      } else {
        // Transition to normal glow
        flickerPhase.current = 'normal'
        animationTime.current = 0
      }
    } else if (flickerPhase.current === 'normal') {
      // Smooth pulsing glow effect (loop)
      const pulse = 0.8 + Math.sin(animationTime.current * 2) * 0.2
      light1Ref.current.intensity = 50 * pulse
      light2Ref.current.intensity = 100 * pulse
    }
  })

  return (
    <>
      <pointLight 
        ref={light1Ref}
        position={[-11.7, 5, -30]} 
        intensity={0} 
        distance={50} 
        decay={2} 
        color="#ffffff" 
      />
      <pointLight 
        ref={light2Ref}
        position={[-11.7, 5, -21]} 
        intensity={0} 
        distance={30} 
        decay={1.5} 
        color="#ffffff" 
      />
    </>
  )
}

// Full Environment lights (no lightning)
function EnvironmentLights({ cameraIntroComplete }) {
  return (
    <>
      {/* Ambient lights */}
      <ambientLight intensity={0.45} color="#943b2b" />
      <ambientLight intensity={0.6} color="#ff0000" />

      {/* Directional lights */}
      <directionalLight position={[5, 10, 5]} intensity={1.2} color="#ffeedd" />
      <directionalLight position={[-8, 3, -5]} intensity={1.5} color="#ff3322" />
      <directionalLight position={[8, 4, -3]} intensity={1.8} color="#0044ff" />

      {/* Spotlight on logo */}
      <spotLight
        position={[0, 12, 18]}
        intensity={8}
        angle={0.35}
        penumbra={0.5}
        decay={1.2}
        distance={120}
        color="#1100ff"
      />

      {/* Strong spotlight on car area - neutral white to show true colors */}
      <mesh position={[-2, 0, -100]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Flickering Lights for signboard */}
      <FlickeringSignboardLights cameraIntroComplete={cameraIntroComplete} />

      {/* Additional smaller, more intense spotlight ahead of car */}
      <spotLight
        position={[-2, 15, 50]}
        intensity={100}
        angle={0.4}
        penumbra={0.3}
        decay={1}
        distance={60}
        color="#ffffff"
        target-position={[-0.6, 0, -30]}
      />

      {/* Point lights - reduced from 8 to 5 */}
      <pointLight position={[-15, 20, -10]} intensity={8} color="#ff0000" distance={100} decay={2} />
      <pointLight position={[15, 25, -15]} intensity={10} color="#0033ff" distance={120} decay={2} />
      <pointLight position={[0, 30, -5]} intensity={6} color="#ff1a1a" distance={90} decay={2} />
      <pointLight position={[0, 100, -150]} intensity={2.0} color="#ff4433" distance={500} />
      <pointLight position={[0, 15, -30]} intensity={8} color="#0066ff" distance={100} decay={2} />
    </>
  )
}

// Main Sky component - full features restored
export default function Sky({ cameraIntroComplete = false }) {
  return (
    <Suspense fallback={null}>
      <ShaderSky />
      <TexturedCloudLayers />
      <EnvironmentLights cameraIntroComplete={cameraIntroComplete} />
    </Suspense>
  )
}
