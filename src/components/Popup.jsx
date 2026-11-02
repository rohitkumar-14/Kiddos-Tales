import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import useSound from "use-sound";
import { HiSparkles, HiBookOpen, HiX } from "react-icons/hi";

const Popup = ({ story, onClose }) => {
  const [playMagic] = useSound(
    "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
    { volume: 0.5 }
  );

  useEffect(() => {
    playMagic();
    // Fire confetti celebration
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.55 },
      colors: ["#FF9EBB", "#FFD700", "#74E2FF", "#98FB98", "#5253A3"],
    });
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white/95 rounded-[3rem] p-8 md:p-12 shadow-2xl border-4 border-white max-w-lg w-full text-center relative overflow-hidden flex flex-col items-center"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition shadow-sm z-20"
          title="Close"
        >
          <HiX size={22} />
        </button>

        {/* Shimmer Accent */}
        <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-30"></div>

        {/* Celebration Header */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#FF4E98] to-[#FFD700] text-white flex items-center justify-center text-4xl shadow-xl shadow-pink-300/60 mb-5 animate-bounce">
          🎉
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-[#5253A3] mb-2 leading-tight">
          Your Story is Ready!
        </h2>
        <p className="text-gray-600 font-bold text-base mb-6 max-w-sm">
          A brand new tale has been woven and illustrated with magic dust.
        </p>

        {/* Book Preview Card */}
        {story && (
          <div className="w-full bg-gradient-to-br from-indigo-50 via-pink-50 to-amber-50 p-6 rounded-3xl border-2 border-indigo-100 shadow-inner mb-8 flex flex-col items-center">
            {story.imageUrl && (
              <div className="w-36 h-48 rounded-2xl overflow-hidden shadow-lg border-4 border-white mb-4 relative group">
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <h3 className="text-2xl font-black text-[#5253A3] line-clamp-2 mb-1">
              {story.title}
            </h3>
            {story.childName && (
              <p className="text-sm font-bold text-kidPink uppercase tracking-wider mb-2">
                Starring: {story.childName} ⭐
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <span className="text-xs font-extrabold bg-white/80 px-3 py-1 rounded-full text-indigo-700 shadow-sm">
                📖 {story.storyType}
              </span>
              <span className="text-xs font-extrabold bg-white/80 px-3 py-1 rounded-full text-pink-700 shadow-sm">
                🎭 {story.storyTone}
              </span>
              <span className="text-xs font-extrabold bg-white/80 px-3 py-1 rounded-full text-emerald-700 shadow-sm">
                🌍 {story.language}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <NavLink
            to="/explore"
            onClick={onClose}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-kidYellow to-amber-400 hover:from-yellow-400 hover:to-amber-500 text-[#5253A3] rounded-full font-black text-lg shadow-xl border-2 border-white transition flex items-center justify-center gap-2"
          >
            <HiBookOpen className="text-xl" />
            <span>Read in Library</span>
          </NavLink>
          <button
            onClick={onClose}
            className="py-4 px-6 bg-white hover:bg-gray-50 text-[#5253A3] rounded-full font-extrabold text-base shadow-md border-2 border-[#5253A3]/20 transition flex items-center justify-center gap-1.5"
          >
            <HiSparkles className="text-kidPink text-lg" />
            <span>Craft Another</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Popup;