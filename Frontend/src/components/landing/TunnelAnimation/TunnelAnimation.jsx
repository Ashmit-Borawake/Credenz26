import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const TunnelAnimation = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const animationActiveRef = useRef(false);
  const requestIdRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0000, 0.002);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1); // Force lowest pixel ratio for max performance

    const tunnelRings = [];
    const connectorLines = [];
    const streaks = [];
    let animationSpeed = 0;
    const clock = new THREE.Clock();

    let gsapControlsOpacity = true;
    let enablePulsing = false;
    let enableFlicker = false;

    // Init Tunnel - REDUCED for performance
    const ringCount = 15;
    const segmentsPerRing = 12;

    for (let ring = 0; ring < ringCount; ring++) {
      const ringGeometry = new THREE.BufferGeometry();
      const ringPositions = new Float32Array((segmentsPerRing + 1) * 3);

      const initialZ = ring * 12 - 100;
      const radius = 15 + Math.sin(ring * 0.3) * 3;

      for (let seg = 0; seg <= segmentsPerRing; seg++) {
        const theta = (seg / segmentsPerRing) * Math.PI * 2;
        const i3 = seg * 3;
        ringPositions[i3] = Math.cos(theta) * radius;
        ringPositions[i3 + 1] = Math.sin(theta) * radius;
        ringPositions[i3 + 2] = 0;
      }

      ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));

      const colorMix = ring / ringCount;
      const ringColor = new THREE.Color(0.8 + colorMix * 0.2, colorMix * 0.3, 0.0);

      const ringMaterial = new THREE.LineBasicMaterial({
        color: ringColor,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });

      const ringLine = new THREE.LineLoop(ringGeometry, ringMaterial);
      ringLine.position.z = initialZ;

      tunnelRings.push({
        mesh: ringLine,
        baseOpacity: 0.6 + Math.random() * 0.4,
        initialZ: initialZ
      });
      scene.add(ringLine);
    }

    // Connectors - REDUCED
    const connectorCount = 6;
    for (let i = 0; i < connectorCount; i++) {
      const connectorGeometry = new THREE.BufferGeometry();
      const connectorPositions = new Float32Array(2 * 3);
      const theta = (i / connectorCount) * Math.PI * 2;

      const radius = 15;
      connectorPositions[0] = Math.cos(theta) * radius;
      connectorPositions[1] = Math.sin(theta) * radius;
      connectorPositions[2] = -100;

      connectorPositions[3] = Math.cos(theta) * radius;
      connectorPositions[4] = Math.sin(theta) * radius;
      connectorPositions[5] = 100;

      connectorGeometry.setAttribute('position', new THREE.BufferAttribute(connectorPositions, 3));
      const connectorMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(0.9, 0.1, 0.0),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });

      const connectorLine = new THREE.Line(connectorGeometry, connectorMaterial);
      connectorLines.push({
        mesh: connectorLine,
        baseOpacity: 0.4
      });
      scene.add(connectorLine);
    }

    // Particles - HEAVILY REDUCED for performance
    const particleCount = 30;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 35;
      positions[i3 + 1] = (Math.random() - 0.5) * 35;
      positions[i3 + 2] = Math.random() * 200 - 100;

      const colorType = Math.random();
      if (colorType < 0.7) {
        colors[i3] = 0.8 + Math.random() * 0.2;
        colors[i3 + 1] = 0.0;
        colors[i3 + 2] = 0.0;
      } else {
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.2 + Math.random() * 0.3;
        colors[i3 + 2] = 0.0;
      }
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Electricity Streaks - HEAVILY REDUCED for performance
    const streakCount = 25;
    for (let i = 0; i < streakCount; i++) {
      const streakGeometry = new THREE.BufferGeometry();
      const streakPositions = new Float32Array(6);

      const radius = 12 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      const z = Math.random() * 200 - 100;

      const offset = (Math.random() - 0.5) * 2;
      streakPositions[0] = x + offset;
      streakPositions[1] = y + offset;
      streakPositions[2] = z;
      streakPositions[3] = x;
      streakPositions[4] = y;
      streakPositions[5] = z - (3 + Math.random() * 4);

      streakGeometry.setAttribute('position', new THREE.BufferAttribute(streakPositions, 3));

      const colorChoice = Math.random();
      let streakColor = (colorChoice < 0.5) ? new THREE.Color(1.0, 0.0, 0.0) :
        (colorChoice < 0.8) ? new THREE.Color(1.0, 0.3, 0.0) :
          new THREE.Color(1.0, 1.0, 1.0);

      const streakMaterial = new THREE.LineBasicMaterial({
        color: streakColor,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });

      const streak = new THREE.Line(streakGeometry, streakMaterial);
      streaks.push({
        mesh: streak,
        speed: 0.3 + Math.random() * 1.8,
        flickerSpeed: 0.5 + Math.random() * 2,
        baseOpacity: 0.4 + Math.random() * 0.4
      });
      scene.add(streak);
    }

    // Lights - simplified
    const ambientLight = new THREE.AmbientLight(0x330000, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff0000, 3, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(1);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop with delta time for smooth frame-rate-independent animation
    const animate = (currentTime) => {
      if (!animationActiveRef.current) return;
      requestIdRef.current = requestAnimationFrame(animate);

      // Delta time for smooth animation regardless of frame rate
      const deltaTime = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const smoothDelta = Math.min(deltaTime, 0.05); // Cap delta to prevent jumps

      tunnelRings.forEach((ring, index) => {
        ring.mesh.rotation.z = elapsedTime * 0.1 + index * 0.05;
        ring.mesh.position.z += animationSpeed * 0.8 * smoothDelta * 60;

        if (ring.mesh.position.z > 20) {
          ring.mesh.position.z -= 200;
        }

        if (enablePulsing && !gsapControlsOpacity) {
          const pulseValue = Math.sin(elapsedTime * 2 + ring.initialZ * 0.1) * 0.2 + 0.8;
          ring.mesh.material.opacity = ring.baseOpacity * pulseValue;
        }
      });

      if (animationSpeed > 0.1) {
        const particlePositions = particleSystem.geometry.attributes.position.array;
        const pSpeed = animationSpeed * 1.2 * smoothDelta * 60;
        for (let i = 0; i < particlePositions.length; i += 3) {
          particlePositions[i + 2] += pSpeed;

          if (particlePositions[i + 2] > 10) {
            particlePositions[i + 2] = -100;
            particlePositions[i] = (Math.random() - 0.5) * 35;
            particlePositions[i + 1] = (Math.random() - 0.5) * 35;
          }
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
      }

      streaks.forEach((streak, index) => {
        streak.mesh.position.z += streak.speed * animationSpeed * smoothDelta * 60;

        if (enableFlicker && !gsapControlsOpacity) {
          const flickerValue = Math.sin(elapsedTime * streak.flickerSpeed + index) * 0.5 + 0.5;
          streak.mesh.material.opacity = (0.2 + flickerValue * 0.6) * (streak.baseOpacity / 0.6);
        }

        if (streak.mesh.position.z > 20) {
          streak.mesh.position.z = -100;
        }
      });



      // Simplified light animation
      pointLight.intensity = 3 + Math.sin(elapsedTime * 2) * 1;

      renderer.render(scene, camera);
    };

    // Start animation
    animationActiveRef.current = true;
    canvas.style.opacity = '1';

    const timeline = gsap.timeline({
      onComplete: () => {
        // Fade out canvas before calling onComplete
        gsap.to(canvas, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            animationActiveRef.current = false;
            if (requestIdRef.current) {
              cancelAnimationFrame(requestIdRef.current);
            }
            if (onComplete) onComplete();
          }
        });
      }
    });

    timeline.to(scene.fog, { density: 0.003, duration: 0.8, ease: 'power2.in' });

    timeline.to(tunnelRings, {
      duration: 1.2,
      onUpdate: function () {
        this.targets().forEach(ring => {
          ring.mesh.material.opacity = this.progress() * ring.baseOpacity;
        });
      }
    }, 0.3);

    timeline.to(connectorLines, {
      duration: 1,
      onUpdate: function () {
        this.targets().forEach(connector => {
          connector.mesh.material.opacity = this.progress() * connector.baseOpacity;
        });
      }
    }, 0.5);

    timeline.to(particleMaterial, { opacity: 0.7, duration: 1, ease: 'power2.out' }, 0.5);

    timeline.to(streaks, {
      duration: 0.8,
      onUpdate: function () {
        this.targets().forEach(streak => {
          streak.mesh.material.opacity = this.progress() * streak.baseOpacity;
        });
      }
    }, 0.5);

    timeline.call(() => {
      gsapControlsOpacity = false;
      enablePulsing = true;
      enableFlicker = true;
    }, null, 1.5);

    timeline.to(camera.position, { z: -50, duration: 2.8, ease: 'power1.in' }, 0);

    // Use a temporary object for animationSpeed
    const speedObj = { value: 0 };
    timeline.to(speedObj, {
      value: 2.5,
      duration: 2.8,
      onUpdate: () => {
        animationSpeed = speedObj.value;
      }
    }, 0);

    timeline.to(camera, {
      fov: 120,
      duration: 1.5,
      ease: 'power3.in',
      onUpdate: () => camera.updateProjectionMatrix()
    }, 0.8);

    timeline.to(pointLight, {
      intensity: 15,
      duration: 1.0,
      ease: 'power2.in'
    }, 1.2);

    timeline.call(() => {
      gsapControlsOpacity = true;
      enablePulsing = false;
      enableFlicker = false;
    }, null, 2.0);

    timeline.to(particleMaterial, { opacity: 0, duration: 0.8, ease: 'power2.out' }, 2.0);

    timeline.to([...tunnelRings, ...connectorLines], {
      duration: 0.8,
      onUpdate: function () {
        this.targets().forEach(item => {
          item.mesh.material.opacity = (1 - this.progress()) * item.baseOpacity;
        });
      }
    }, 2.2);

    timeline.to(scene.fog.color, {
      r: 0.3, g: 0.0, b: 0.0,
      duration: 0.5,
      ease: 'power2.in'
    }, 2.4);

    animate();

    return () => {
      animationActiveRef.current = false;
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-10000"
      style={{ opacity: 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}
    />
  );
};
