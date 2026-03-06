import { useGLTF } from '@react-three/drei';

// Cache for loaded models
const modelCache = {};

/**
 * Load a 3D model with caching and error handling
 * @param {string} path - Path to the model file
 * @returns {object} Model data or null if not loaded yet
 */
export const loadModelWithCache = (path) => {
  if (!path) return null;
  
  try {
    const data = useGLTF(path);
    if (!modelCache[path]) {
      modelCache[path] = data;
    }
    return data;
  } catch (error) {
    console.warn(`Failed to load model: ${path}`, error);
    return null;
  }
};

/**
 * Preload a model in the background
 * @param {string} path - Path to the model file
 */
export const preloadModel = (path) => {
  if (!path || modelCache[path]) return;
  
  try {
    useGLTF.preload(path);
  } catch (error) {
    console.warn(`Failed to preload model: ${path}`, error);
  }
};

/**
 * Get model from cache or load it
 * @param {string} path - Path to the model file
 * @returns {object} Model data
 */
export const getOrLoadModel = (path) => {
  if (modelCache[path]) {
    return modelCache[path];
  }
  return loadModelWithCache(path);
};

/**
 * Cleanup model from memory (useful for freeing resources)
 * @param {string} path - Path to the model file
 */
export const unloadModel = (path) => {
  if (modelCache[path]) {
    // Dispose geometries and materials
    if (modelCache[path].scene) {
      modelCache[path].scene.traverse((node) => {
        if (node.geometry) node.geometry.dispose();
        if (node.material) {
          if (Array.isArray(node.material)) {
            node.material.forEach(m => m.dispose());
          } else {
            node.material.dispose();
          }
        }
      });
    }
    delete modelCache[path];
  }
};

export default { loadModelWithCache, preloadModel, getOrLoadModel, unloadModel };
