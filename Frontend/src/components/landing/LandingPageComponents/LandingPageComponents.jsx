import React from 'react';

const LandingPageComponents = () => {
  return (
    <div className="w-screen h-screen relative">
      {/* Logo positioned at top-left */}
      <div className="absolute top-8 left-8 z-20">
        <div className="flex gap-1">
          <p className="custom-shadow2 text-4xl md:text-6xl text-black">
            CREDENZ
          </p>
          <p className="custom-shadow2 text-4xl md:text-6xl text-black">
            '26
          </p>
        </div>
        <p className="custom-shadow2 -mt-2 text-lg md:text-2xl text-black">
          Landing Page
        </p>
      </div>
    </div>
  );
};

export default LandingPageComponents;
