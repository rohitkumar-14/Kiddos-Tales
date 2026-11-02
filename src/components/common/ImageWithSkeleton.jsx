import React, { useState } from "react";

/**
 * ImageWithSkeleton renders an <img> with an animated shimmer skeleton placeholder.
 * Once loaded, the image transitions smoothly into view.
 */
const ImageWithSkeleton = ({
  src,
  alt = "Image",
  className = "",
  skeletonClassName = "",
  containerClassName = "",
  loading = "lazy",
  style = {},
  onLoad,
  onError,
  fallbackIcon = "🎨",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    setIsLoaded(true);
    if (onError) onError(e);
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Animated Skeleton Shimmer Placeholder */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 z-10 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 animate-shimmer flex items-center justify-center ${skeletonClassName}`}
        >
          <div className="flex flex-col items-center justify-center opacity-40 animate-pulse">
            <span className="text-3xl select-none">✨</span>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {hasError ? (
        <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center bg-purple-50 text-gray-400 p-4 rounded-2xl border-2 border-dashed border-purple-200">
          <span className="text-3xl mb-1">{fallbackIcon}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            Image loading...
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={style}
          className={`${className} transition-opacity duration-500 ease-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};

export default ImageWithSkeleton;
