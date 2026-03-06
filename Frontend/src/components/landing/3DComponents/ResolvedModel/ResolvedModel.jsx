import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/ka_new.glb";

const ResolvedModel = ({ setLoaded }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(MODEL_PATH);

  // useAnimations hook properly binds animations to the scene
  const { actions, mixer } = useAnimations(animations, group);

  // Notify when model is loaded
  useEffect(() => {
    if (scene) {
      setLoaded(true);
    }
  }, [scene, setLoaded]);

  // Play all animations on loop
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      //console.log('Found animations:', Object.keys(actions));
      Object.values(actions).forEach((action) => {
        if (action) {
          action.reset().fadeIn(0.5).play();
        }
      });
    }
  }, [actions]);

  // Optimize meshes - run once
  useEffect(() => {
    scene.traverse((child) => {
      // Enable frustum culling for performance
      child.frustumCulled = true;

      // Preserve lights from the GLB (street lamps, etc.)
      if (child.isLight) {
        //console.log('Found light in model:', child.type, child.name);
        return;
      }

      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;

        if (child.geometry) {
          child.geometry.computeBoundingSphere();
        }

        // Preserve original emissive values from Blender
        const material = child.material;
        if (material && material.isMeshStandardMaterial) {
          const hasEmissive =
            material.emissive &&
            (material.emissive.r > 0 ||
              material.emissive.g > 0 ||
              material.emissive.b > 0);
          const hasEmissiveMap = material.emissiveMap !== null;

          if (!hasEmissive && !hasEmissiveMap) {
            material.emissive = new THREE.Color("#111111");
            material.emissiveIntensity = 0.05;
          }

          material.envMapIntensity = 0.3;
          material.side = THREE.FrontSide;
        }
      }
    });
  }, [scene]);

  return (
    <group ref={group}>
      <primitive
        object={scene}
        scale={1}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
};

useGLTF.preload(MODEL_PATH);

export default ResolvedModel;
