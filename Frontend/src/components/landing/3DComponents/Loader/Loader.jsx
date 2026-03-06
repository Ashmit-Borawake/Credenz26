import { useProgress } from "@react-three/drei";
import { useEffect } from "react";

const Loader = ({ setLoaded, setLoadingProgress }) => {
  const { progress } = useProgress();

  useEffect(() => {
    // Report progress to parent
    if (setLoadingProgress) {
      setLoadingProgress(progress);
    }
  }, [progress, setLoadingProgress]);

  useEffect(() => {
    return () => {
      setLoaded(true);
    };
  }, [setLoaded]);

  // Return null - the loading UI is handled by the Loading component
  return null;
};

export default Loader;
