
import { useState, useRef, useEffect } from 'react';

interface FastImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  loading?: 'lazy' | 'eager';
}

export const FastImage = ({ 
  src, 
  alt, 
  className, 
  style,
  onError,
  loading = 'lazy'
}: FastImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Preload high priority images
    if (loading === 'eager' && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setHasError(true);
    }
  }, [src, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      ref={imgRef}
      src={hasError ? "/placeholder.svg" : src}
      alt={alt}
      className={`${className} transition-opacity duration-200 ${
        isLoaded || loading === 'eager' ? 'opacity-100' : 'opacity-0'
      }`}
      style={style}
      onLoad={handleLoad}
      onError={handleError}
      loading={loading}
      decoding="async"
    />
  );
};
