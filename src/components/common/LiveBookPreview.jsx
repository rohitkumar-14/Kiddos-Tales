import React from "react";
import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi";

const heroAvatars = {
  human: "🧒",
  animal: "🦊",
  fantasy: "🦄",
  robot: "🤖",
};

const LiveBookPreview = ({
  childName,
  subject,
  heroTraits,
  storyType,
  ageGroup,
  storyTone,
  storyTheme,
  storyLength,
  language,
}) => {
  const avatar = heroAvatars[heroTraits?.type] || "✨";

  const displayTitle = childName
    ? `${childName}'s Adventure`
    : subject
    ? subject.length > 28
      ? subject.substring(0, 28) + "..."
      : subject
    : "Your Magical Tale";

  const readTime =
    storyLength === "short"
      ? "3 min read"
      : storyLength === "long"
      ? "10 min read"
      : "5 min read";

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header Pill */}
      <div className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-md px-4 py-1 rounded-full border-2 border-white shadow-sm mb-3">
        <HiSparkles className="text-kidPink text-sm animate-spin" style={{ animationDuration: "8s" }} />
        <span className="text-xs font-black uppercase tracking-wider text-[#5253A3]">
          Live Book Preview
        </span>
      </div>

      {/* 3D Storybook Wrapper */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="relative w-full max-w-[280px] h-[370px] rounded-r-3xl rounded-l-md border-l-[14px] border-[#a04865] bg-gradient-to-br from-pink-200 via-indigo-100 to-amber-100 shadow-[0_20px_45px_rgba(82,83,163,0.35)] p-5 flex flex-col justify-between overflow-hidden border-2 border-white/60 select-none"
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-25"></div>

        {/* Ribbon Bookmark */}
        <div className="absolute -top-1 right-8 w-6 h-12 bg-kidYellow rounded-b-md shadow-md border-x border-b border-yellow-400"></div>

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-[#5253A3] shadow-sm">
            {storyType || "Storybook"}
          </span>
          <span className="text-[10px] font-black bg-white/80 px-2.5 py-1 rounded-full text-indigo-700 shadow-sm">
            {language || "English"}
          </span>
        </div>

        {/* Center Illustration Portal */}
        <div className="relative z-10 flex-1 my-3 rounded-2xl bg-white/70 backdrop-blur-md border-2 border-white shadow-inner flex flex-col items-center justify-center p-3 text-center overflow-hidden">
          <motion.div
            key={avatar + (heroTraits?.personality || "")}
            initial={{ scale: 0.6, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-6xl mb-2 drop-shadow-md select-none"
          >
            {avatar}
          </motion.div>
          <h4 className="text-xl font-black text-[#5253A3] line-clamp-2 leading-tight">
            {displayTitle}
          </h4>
          {childName && (
            <p className="text-xs font-bold text-kidPink mt-1">
              Starring {childName} ⭐
            </p>
          )}
          {heroTraits?.personality && (
            <span className="text-[11px] font-semibold text-gray-500 capitalize">
              The {heroTraits.personality} {heroTraits.type}
            </span>
          )}
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 flex flex-wrap gap-1.5 justify-center">
          {storyTone && (
            <span className="text-[10px] font-extrabold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full capitalize">
              {storyTone}
            </span>
          )}
          {storyTheme && (
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full capitalize">
              {storyTheme}
            </span>
          )}
          <span className="text-[10px] font-extrabold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {readTime}
          </span>
          {ageGroup && (
            <span className="text-[10px] font-extrabold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {ageGroup} yrs
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LiveBookPreview;
