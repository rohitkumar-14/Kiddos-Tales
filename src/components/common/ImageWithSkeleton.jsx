import React, { useState, useEffect } from "react";
import { HiSparkles, HiBookOpen } from "react-icons/hi";
import defaultCoverFallback from "../../assets/story.webp";

/**
 * ImageWithSkeleton renders an <img> with an animated shimmer skeleton placeholder.
 * Handles missing src, load errors, and provides seamless fallback to bundled local assets.
 */
const ImageWithSkeleton = ({
  src,
  fallbackSrc = defaultCoverFallback,
  alt = "Story Book Cover",
  className = "",
  skeletonClassName = "",
  containerClassName = "",
  loading = "lazy",
  style = {},
  onLoad,
  onError,
}) => {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const validSrc = src || fallbackSrc;
    setCurrentSrc(validSrc);
    setIsLoaded(false);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    // If the primary image failed and we haven't tried the fallback yet, switch to fallback
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoaded(false);
    } else {
      setHasError(true);
      setIsLoaded(true);
      if (onError) onError(e);
    }
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Animated Skeleton Shimmer Placeholder */}
      {!isLoaded && !hasError && (
        <div
          className={`absolute inset-0 z-10 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 animate-shimmer flex items-center justify-center ${skeletonClassName}`}
        >
          <div className="flex flex-col items-center justify-center opacity-60 animate-pulse">
            <HiSparkles className="text-3xl text-kidPink mb-1" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#5253A3]">
              Magic loading...
            </span>
          </div>
        </div>
      )}

      {/* Fallback Display if both primary & fallback failed */}
      {hasError ? (
        <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 text-gray-500 p-4 rounded-2xl border-2 border-dashed border-indigo-200 text-center">
          <HiBookOpen className="text-4xl text-[#5253A3] mb-1" />
          <span className="text-xs font-black uppercase tracking-wider text-[#5253A3]">
            {alt || "Magical Story"}
          </span>
        </div>
      ) : (
        <img
          src={currentSrc}
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
