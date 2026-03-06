import { useContext, createContext, useRef, useState } from "react";

const ModelLoadingContext = createContext();

export const ModelLoadingProvider = ({ children }) => {
  // Use state instead of ref so components re-render when this changes
  const [hasVisitedLanding, setHasVisitedLanding] = useState(false);
  const modelLoaded = useRef(false);
  const backgroundModelLoaded = useRef(false);

  const markLandingVisited = () => {
    setHasVisitedLanding(true);
    modelLoaded.current = true;
    backgroundModelLoaded.current = true;
  };

  return (
    <ModelLoadingContext.Provider value={{ 
      modelLoaded, 
      backgroundModelLoaded, 
      hasVisitedLanding,
      markLandingVisited 
    }}>
      {children}
    </ModelLoadingContext.Provider>
  );
};

export const useModelLoading = () => useContext(ModelLoadingContext);
