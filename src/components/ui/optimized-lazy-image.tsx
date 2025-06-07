
import { useState, useRef, useEffect, memo } from 'react';

interface OptimizedLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
}

export const OptimizedLazyImage = memo(({ 
  src, 
  alt, 
  className, 
  containerClassName,
  priority = false 
}: OptimizedLazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

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
            className={`${className} transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
          {!isLoaded && (
            <div className={`${className} animate-pulse bg-gray-200 absolute inset-0`} />
          )}
        </>
      )}
    </div>
  );
});

OptimizedLazyImage.displayName = 'OptimizedLazyImage';
