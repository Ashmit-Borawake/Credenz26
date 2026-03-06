import { useThree } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

// Shared lookAt target - looking slightly left and upward
export const CAMERA_LOOK_AT = new THREE.Vector3(0,0,0)

export default function CameraIntro({ enabled = true, onComplete }) {
  const { camera } = useThree()
  const hasStarted = useRef(false)
  const tweenRef = useRef(null)

  useEffect(() => {
    if (!enabled || hasStarted.current) return
    hasStarted.current = true

    // Set initial position
    camera.position.set(10, 30, 20)
    camera.lookAt(CAMERA_LOOK_AT)

    // Small delay to let GPU stabilize, then animate
    const timeout = setTimeout(() => {
      tweenRef.current = gsap.to(camera.position, {
        x: 1,
        y: 3,
        z: 25,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          camera.lookAt(CAMERA_LOOK_AT)
        },
        onComplete: () => {
          if (onComplete) onComplete()
        }
      })
    }, 100) // 100ms delay for GPU to stabilize

    return () => {
      clearTimeout(timeout)
      if (tweenRef.current) {
        tweenRef.current.kill()
      }
    }
  }, [enabled, camera, onComplete])

  return null
}
