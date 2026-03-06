import { useEffect, useRef, useState } from 'react';

/**
 * Hook to lazy-load images with IntersectionObserver
 * @param {string} src - Image source
 * @param {string} placeholder - Placeholder while loading
 * @returns {object} { ref, isLoaded, src }
 */
export const useLazyImage = (src, placeholder = '') => {
  const ref = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder || src);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            setIsLoaded(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [src]);

  return { ref, isLoaded, imageSrc };
};

/**
 * Component for lazy-loading images
 */
export const LazyImage = ({ src, alt, className, width, height, placeholder, ...props }) => {
  const { ref, imageSrc, isLoaded } = useLazyImage(src, placeholder);

  return (
    <img
      ref={ref}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
      style={{
        opacity: isLoaded ? 1 : 0.5,
        transition: 'opacity 0.3s ease-in-out',
      }}
      width={width}
      height={height}
      loading="lazy"
      {...props}
    />
  );
};

export default { useLazyImage, LazyImage };
