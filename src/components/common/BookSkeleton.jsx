import React from "react";
import { motion } from "framer-motion";

/**
 * BookSkeleton renders a placeholder book card with animated shimmer
 * to indicate loading in the library or when generating a story.
 */
const BookSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative z-10 w-[320px] md:w-[420px] h-[520px] rounded-r-2xl border-l-[16px] border-pink-300 shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden bg-white/70 backdrop-blur-md flex flex-col justify-between p-6 animate-shimmer"
    >
      {/* Top Header Placeholder */}
      <div className="w-full flex flex-col items-center gap-3 mt-4">
        <div className="w-3/4 h-8 bg-purple-200/70 rounded-full animate-pulse"></div>
        <div className="w-1/2 h-5 bg-pink-200/70 rounded-full animate-pulse"></div>
      </div>

      {/* Center Illustration Placeholder */}
      <div className="w-full flex-1 my-6 rounded-2xl bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 border-2 border-dashed border-purple-200/60 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="flex flex-col items-center gap-2 opacity-50 animate-pulse">
          <span className="text-5xl select-none">📖</span>
          <span className="text-sm font-bold text-[#5253A3]">Creating your magic book...</span>
        </div>
      </div>

      {/* Bottom Button Placeholders */}
      <div className="w-full flex flex-col gap-3">
        <div className="w-full h-10 bg-yellow-200/70 rounded-full animate-pulse"></div>
        <div className="w-full h-10 bg-blue-200/70 rounded-full animate-pulse"></div>
      </div>
    </motion.div>
  );
};

export default BookSkeleton;
