import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * SelectableCardWithSkeleton provides an animated skeleton placeholder
 * while the card image loads, then smoothly reveals the image.
 * Maintains full interactive animations (hover, tap, active ring, grayscale toggle).
 */
const SelectableCardWithSkeleton = ({
  label,
  imageUrl,
  isSelected,
  onClick,
  size = "standard", // "large" | "standard"
  ringColor = "ring-kidPink",
  placeholderIcon = "✨",
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isLarge = size === "large";

  const sizeClasses = isLarge
    ? "w-[250px] h-[350px] rounded-[3rem]"
    : "w-[180px] h-[250px] rounded-3xl";

  const ringClasses = isSelected
    ? isLarge
      ? `ring-[12px] ${ringColor} ring-offset-8 ring-offset-[#CAD3FF] grayscale-0 scale-105`
      : `ring-8 ${ringColor} ring-offset-4 ring-offset-[#CAD3FF] grayscale-0`
    : "grayscale hover:grayscale-[50%]";

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      className={`relative cursor-pointer overflow-hidden flex items-end justify-center shadow-xl transition-all duration-500 select-none ${sizeClasses} ${ringClasses}`}
    >
      {/* Skeleton Shimmer Overlay while loading */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-indigo-100 via-pink-100 to-amber-100 animate-shimmer flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center opacity-50 animate-pulse">
            <span className="text-4xl mb-2">{placeholderIcon}</span>
            <span className="text-xs font-bold text-[#5253A3] uppercase tracking-wider">
              Loading...
            </span>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {imageError ? (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-4xl mb-2">{placeholderIcon}</span>
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
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Label Badge */}
      <span
        className={`relative z-20 font-black text-white text-center backdrop-blur-md shadow-lg border-2 border-white/30 transition-all ${
          isLarge
            ? "text-lg bg-black/50 px-6 py-2 rounded-full mb-6"
            : "text-lg font-extrabold bg-black/40 px-3 py-1 rounded-full mb-4"
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
};

export default SelectableCardWithSkeleton;
