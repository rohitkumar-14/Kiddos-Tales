import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * SelectableCardWithSkeleton provides an animated skeleton placeholder
 * while the card image loads, then smoothly reveals the image.
 * Uses fluid responsive grid-friendly sizing to prevent layout overlap.
 */
const SelectableCardWithSkeleton = ({
  label,
  imageUrl,
  isSelected,
  onClick,
  size = "standard", // "large" | "standard"
  ringColor = "ring-kidPink",
  placeholderIcon = "✨",
  className = "",
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isLarge = size === "large";

  const sizeClasses = isLarge
    ? "w-full aspect-[3/4] max-h-[290px] rounded-[2rem]"
    : "w-full aspect-[3/4] max-h-[220px] rounded-2xl";

  const ringClasses = isSelected
    ? isLarge
      ? `ring-4 sm:ring-6 ${ringColor} ring-offset-2 ring-offset-white/90 grayscale-0 shadow-2xl scale-[1.02]`
      : `ring-4 ${ringColor} ring-offset-2 ring-offset-white/90 grayscale-0 shadow-xl scale-[1.02]`
    : "grayscale hover:grayscale-[30%] opacity-85 hover:opacity-100 hover:scale-[1.02]";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      className={`relative cursor-pointer overflow-hidden flex items-end justify-center shadow-md transition-all duration-300 select-none mx-auto ${sizeClasses} ${ringClasses} ${className}`}
    >
      {/* Selected Indicator Badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-30 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-[#5253A3] font-black text-xs border border-gray-200">
          ✓
        </div>
      )}

      {/* Skeleton Shimmer Overlay while loading */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-indigo-100 via-pink-100 to-amber-100 animate-shimmer flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center opacity-50 animate-pulse">
            <span className="text-3xl mb-1">{placeholderIcon}</span>
            <span className="text-[10px] font-bold text-[#5253A3] uppercase tracking-wider">
              Loading...
            </span>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {imageError ? (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 flex flex-col items-center justify-center p-3 text-center">
          <span className="text-3xl mb-1">{placeholderIcon}</span>
          <span className="text-xs font-bold text-[#5253A3]">{label}</span>
        </div>
      ) : (
        /* Image Element */
        <img
          src={imageUrl}
          alt={label}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Subtle bottom shadow gradient to make label readable */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />

      {/* Label Badge */}
      <span
        className={`relative z-20 font-black text-white text-center backdrop-blur-md shadow-md border border-white/40 transition-all truncate max-w-[90%] ${
          isLarge
            ? "text-sm sm:text-base bg-black/50 px-4 py-1.5 rounded-full mb-3"
            : "text-xs sm:text-sm font-extrabold bg-black/50 px-3 py-1 rounded-full mb-2.5"
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
};

export default SelectableCardWithSkeleton;
