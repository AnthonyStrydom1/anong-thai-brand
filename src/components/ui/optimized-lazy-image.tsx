
import { useState, useRef, useEffect, memo } from 'react';

interface OptimizedLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  eager?: boolean;
}

export const OptimizedLazyImage = memo(({ 
  src, 
  alt, 
  className, 
  containerClassName,
  priority = false,
  eager = false
}: OptimizedLazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority || eager);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || eager) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Preload images 100px before they come into view
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, eager]);

  // Preload critical images
  useEffect(() => {
    if (priority && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setHasError(true);
    }
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={containerClassName}>
      {isInView && (
        <>
          <img
            src={hasError ? "/placeholder.svg" : src}
            alt={alt}
            className={`${className} transition-opacity duration-200 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority || eager ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
          />
          {!isLoaded && (
            <div className={`${className} bg-gray-100 absolute inset-0 animate-pulse`} />
          )}
        </>
      )}
      {!isInView && !priority && !eager && (
        <div className={`${className} bg-gray-100 animate-pulse`} />
      )}
    </div>
  );
});

OptimizedLazyImage.displayName = 'OptimizedLazyImage';
