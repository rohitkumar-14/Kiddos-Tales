import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const loadingSteps = [
  "Sprinkling magic dust... ✨",
  "Weaving your adventure... 📖",
  "Painting colorful illustrations... 🎨",
  "Adding sound effects & quiz questions... 🧠",
  "Binding your brand new book... 🌟",
];

const Loader = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/95 rounded-[3rem] p-8 md:p-12 shadow-2xl border-4 border-white max-w-md w-full text-center flex flex-col items-center relative overflow-hidden"
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-40"></div>

        {/* Book Skeleton Card Preview */}
        <div className="w-48 h-64 rounded-2xl bg-gradient-to-br from-pink-100 via-indigo-50 to-blue-100 border-4 border-kidPink/50 shadow-inner flex flex-col items-center justify-between p-4 mb-6 relative overflow-hidden">
          <div className="w-full flex flex-col items-center gap-2 mt-2">
            <div className="w-3/4 h-4 bg-purple-200 rounded-full animate-pulse"></div>
            <div className="w-1/2 h-3 bg-pink-200 rounded-full animate-pulse"></div>
          </div>
          <div className="text-5xl animate-bounce my-auto">✨</div>
          <div className="w-full flex gap-2">
            <div className="flex-1 h-3 bg-yellow-200 rounded-full animate-pulse"></div>
            <div className="flex-1 h-3 bg-blue-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Animated Text */}
        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-black text-[#5253A3] mb-3 min-h-[36px]"
        >
          {loadingSteps[stepIndex]}
        </motion.p>

        <p className="text-sm font-bold text-gray-400">
          Hold tight, our AI artist is drawing your magical pages!
        </p>

        {/* Shimmering Progress Bar */}
        <div className="w-full bg-gray-100 h-3 rounded-full mt-6 overflow-hidden relative">
          <div className="bg-gradient-to-r from-kidPink via-kidYellow to-kidBlue h-full rounded-full animate-pulse w-full"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Loader;