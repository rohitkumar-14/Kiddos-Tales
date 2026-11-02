import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { HiSparkles, HiBookOpen, HiVolumeUp, HiColorSwatch, HiShieldCheck } from "react-icons/hi";
import { FaMagic, FaStar, FaGlobe, FaPrint } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import confetti from "canvas-confetti";
import useSound from "use-sound";

// Interactive 3D Tilt Card Component with Parallax Depth and Specular Glare
const TiltCard = ({ step, index, onHoverSound }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for realistic physical tilt response
  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["14deg", "-14deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-14deg", "14deg"]);

  // Dynamic glare coordinates
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);

    setGlare({
      x: (mouseX / rect.width) * 100,
      y: (mouseY / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseEnter = () => {
    if (onHoverSound) onHoverSound();
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      style={{ perspective: 1100 }}
      className="w-full flex justify-center"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.12, duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.04 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative w-full max-w-[320px] rounded-[2.5rem] p-8 border-4 border-white transition-shadow duration-500 cursor-pointer select-none flex flex-col justify-between items-center text-center ${step.cardBg} ${step.shadowColor} shadow-xl hover:shadow-2xl`}
      >
        {/* Dynamic Specular Glare Reflection */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[2.3rem] transition-opacity duration-300 z-30"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 65%)`,
          }}
        />

        {/* Floating Number & Category Pill (Parallax Z: 35px) */}
        <div
          style={{ transform: "translateZ(35px)" }}
          className="w-full flex items-center justify-between mb-4 z-20"
        >
          <span
            className={`px-3.5 py-1 rounded-full text-xs font-black tracking-widest uppercase shadow-sm border border-white/60 ${step.pillBg} ${step.pillText}`}
          >
            {step.stepNumber}
          </span>
          <span className="text-xl animate-pulse">{step.miniEmoji}</span>
        </div>

        {/* 3D Popping Icon Orb (Parallax Z: 70px) */}
        <div
          style={{ transform: "translateZ(70px)" }}
          className="my-3 z-20 relative group"
        >
          <motion.div
            animate={step.idleAnimation}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className={`w-24 h-24 rounded-3xl ${step.iconBg} flex items-center justify-center text-white shadow-xl ${step.iconShadow} border-4 border-white/80 transform transition-transform group-hover:scale-110`}
          >
            {step.icon}
          </motion.div>
          {/* Subtle glow ring under icon */}
          <div
            className={`absolute -inset-2 rounded-3xl ${step.glowColor} opacity-40 blur-lg -z-10`}
          ></div>
        </div>

        {/* Card Title (Parallax Z: 45px) */}
        <h3
          style={{ transform: "translateZ(45px)" }}
          className="text-2xl font-black text-[#5253A3] mt-3 mb-2 z-20"
        >
          {step.title}
        </h3>

        {/* Card Description (Parallax Z: 25px) */}
        <p
          style={{ transform: "translateZ(25px)" }}
          className="text-gray-600 text-sm md:text-base leading-relaxed font-medium z-20 mb-5"
        >
          {step.desc}
        </p>

        {/* Bottom Playful Feature Badge (Parallax Z: 40px) */}
        <div
          style={{ transform: "translateZ(40px)" }}
          className={`w-full py-2 px-4 rounded-2xl ${step.chipBg} border border-white shadow-sm flex items-center justify-center gap-1.5 z-20`}
        >
          <span className="text-xs font-black tracking-wide text-gray-700">
            {step.featureChip}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

const AboutSection = () => {
  const [playPop] = useSound(
    "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
    { volume: 0.25 }
  );

  const triggerConfetti = (e) => {
    if (e) e.stopPropagation();
    playPop();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.65 },
      colors: ["#FF4E98", "#FFD700", "#00D2FF", "#98FB98", "#FFFFFF"],
    });
  };

  const steps = [
    {
      stepNumber: "Step 01",
      title: "Imagine",
      desc: "Tell us a name, a secret place, or favorite hero. Our AI weaves a tailor-made adventure in seconds.",
      featureChip: "✨ Infinite Personalization",
      miniEmoji: "🪄",
      cardBg: "bg-gradient-to-b from-amber-50/90 via-white to-amber-50/50",
      shadowColor: "hover:shadow-amber-200/60",
      pillBg: "bg-amber-100/90",
      pillText: "text-amber-800",
      iconBg: "bg-gradient-to-tr from-amber-400 to-yellow-300",
      iconShadow: "shadow-amber-300/60",
      glowColor: "bg-amber-300",
      chipBg: "bg-amber-100/70",
      icon: <HiSparkles className="text-5xl drop-shadow-sm" />,
      idleAnimation: { y: [0, -8, 0], rotate: [0, 5, -5, 0] },
    },
    {
      stepNumber: "Step 02",
      title: "Read & Learn",
      desc: "Interactive vocabulary quizzes and dual-language reading help your little explorer grow as they turn pages.",
      featureChip: "🧠 Bilingual & Quizzes",
      miniEmoji: "📚",
      cardBg: "bg-gradient-to-b from-sky-50/90 via-white to-sky-50/50",
      shadowColor: "hover:shadow-sky-200/60",
      pillBg: "bg-sky-100/90",
      pillText: "text-sky-800",
      iconBg: "bg-gradient-to-tr from-sky-400 to-blue-500",
      iconShadow: "shadow-sky-300/60",
      glowColor: "bg-sky-300",
      chipBg: "bg-sky-100/70",
      icon: <HiBookOpen className="text-5xl drop-shadow-sm" />,
      idleAnimation: { y: [0, 6, 0], scale: [1, 1.04, 1] },
    },
    {
      stepNumber: "Step 03",
      title: "Listen",
      desc: "Switch to Audiobook mode! Our magical narrator reads aloud with expressive voices and automatic page turns.",
      featureChip: "🎧 Smart Read-Aloud",
      miniEmoji: "🎵",
      cardBg: "bg-gradient-to-b from-pink-50/90 via-white to-pink-50/50",
      shadowColor: "hover:shadow-pink-200/60",
      pillBg: "bg-pink-100/90",
      pillText: "text-pink-800",
      iconBg: "bg-gradient-to-tr from-[#FF4E98] to-rose-400",
      iconShadow: "shadow-pink-300/60",
      glowColor: "bg-pink-300",
      chipBg: "bg-pink-100/70",
      icon: <HiVolumeUp className="text-5xl drop-shadow-sm" />,
      idleAnimation: { y: [0, -6, 0], rotate: [0, -6, 6, 0] },
    },
    {
      stepNumber: "Step 04",
      title: "Create Art",
      desc: "Turn every story into a printable coloring book. Download clean outline pages so your child illustrates the fun!",
      featureChip: "🖍️ Printable Coloring Books",
      miniEmoji: "🎨",
      cardBg: "bg-gradient-to-b from-emerald-50/90 via-white to-emerald-50/50",
      shadowColor: "hover:shadow-emerald-200/60",
      pillBg: "bg-emerald-100/90",
      pillText: "text-emerald-800",
      iconBg: "bg-gradient-to-tr from-emerald-400 to-teal-500",
      iconShadow: "shadow-emerald-300/60",
      glowColor: "bg-emerald-300",
      chipBg: "bg-emerald-100/70",
      icon: <HiColorSwatch className="text-5xl drop-shadow-sm" />,
      idleAnimation: { rotate: [0, 8, -8, 0], scale: [1, 1.03, 1] },
    },
  ];

  return (
    <section className="py-24 px-6 md:px-16 bg-white/40 backdrop-blur-xl relative overflow-hidden border-t-4 border-white/60">
      {/* Playful Floating Background Doodles */}
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-12 left-10 text-4xl opacity-40 select-none pointer-events-none"
      >
        ⭐
      </motion.div>
      <motion.div
        animate={{ y: [0, 16, 0], rotate: [0, -12, 12, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
        className="absolute top-24 right-14 text-4xl opacity-40 select-none pointer-events-none"
      >
        🌈
      </motion.div>
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 left-16 text-5xl opacity-40 select-none pointer-events-none hidden md:block"
      >
        ☁️
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute bottom-28 right-24 text-4xl opacity-40 select-none pointer-events-none hidden md:block"
      >
        ✨
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          {/* Playful Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white shadow-md mb-6 hover:scale-105 transition-transform cursor-default">
            <span className="text-[#FF4E98] text-sm md:text-base font-black tracking-wider uppercase flex items-center gap-2">
              <FaStar className="text-yellow-400 animate-spin" style={{ animationDuration: "6s" }} />
              How The Magic Happens
              <FaStar className="text-yellow-400 animate-spin" style={{ animationDuration: "6s" }} />
            </span>
          </div>

          {/* Heading with reliable crisp glowing icon instead of missing glyph */}
          <h2 className="text-5xl md:text-7xl font-black text-[#5253A3] mb-6 flex items-center justify-center flex-wrap gap-4 drop-shadow-sm">
            <span>What is KiddoTales?</span>
            <span className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-3xl bg-gradient-to-tr from-[#FF4E98] to-[#00D2FF] text-white shadow-lg shadow-pink-300/50 animate-bounce">
              <FaMagic className="text-2xl md:text-3xl" />
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-[#5253A3]/85 max-w-3xl mx-auto leading-relaxed font-bold">
            We combine generative AI with a love for storytelling to turn every child
            into the proud hero of their own fully illustrated adventure.
          </p>
        </motion.div>

        {/* 4 Interactive 3D Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10">
          {steps.map((step, index) => (
            <TiltCard
              key={index}
              step={step}
              index={index}
              onHoverSound={playPop}
            />
          ))}
        </div>

        {/* Upgraded Magical Creator Showcase Banner */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-28 p-8 md:p-14 bg-gradient-to-br from-[#4c4da1] via-[#5253A3] to-[#393a80] rounded-[3.5rem] text-white text-center relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(82,83,163,0.45)] border-4 border-white"
        >
          {/* Ambient Colorful Blobs for Aurora Effect */}
          <div className="absolute -top-24 -left-20 w-80 h-80 bg-[#FF4E98] rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-blob"></div>
          <div className="absolute top-1/2 -right-20 w-80 h-80 bg-[#00D2FF] rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-kidYellow rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

          {/* Interactive Floating Confetti Popper Trigger */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerConfetti}
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-2.5 rounded-full border-2 border-white/60 text-yellow-300 font-black text-sm md:text-base shadow-lg mb-6 cursor-pointer relative z-10 transition-colors"
          >
            <span className="text-2xl animate-bounce">🎉</span>
            <span>Tap For Magic Confetti! ✨</span>
          </motion.button>

          <h3 className="text-4xl md:text-6xl font-black mb-4 relative z-10 drop-shadow-md">
            More than just a book site.
          </h3>
          <p className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 relative z-10 font-bold leading-relaxed">
            KiddoTales is a bedtime companion for parents and an infinite playground
            for little dreamers. Bond, laugh, learn, and weave unforgettable adventures
            that last a lifetime!
          </p>

          {/* 4 Interactive Bento Power-Up Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 relative z-10">
            <motion.div
              whileHover={{ y: -8, scale: 1.03 }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-6 rounded-3xl border-2 border-white/30 hover:border-yellow-300 transition-all shadow-md text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-yellow-400/30 flex items-center justify-center text-yellow-300 text-2xl mb-4 border border-yellow-300/40">
                  <HiShieldCheck />
                </div>
                <h4 className="text-xl font-black mb-2 text-white">100% Ad-Free</h4>
                <p className="text-sm text-white/80 font-medium leading-relaxed">
                  Zero tracking or popups. A safe digital sanctuary built strictly for children.
                </p>
              </div>
              <span className="mt-4 inline-block text-xs font-black uppercase tracking-wider text-yellow-300">
                🛡️ Verified Safe
              </span>
            </motion.div>

            <motion.div
              whileHover={{ y: -8, scale: 1.03 }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-6 rounded-3xl border-2 border-white/30 hover:border-pink-300 transition-all shadow-md text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-pink-400/30 flex items-center justify-center text-pink-300 text-2xl mb-4 border border-pink-300/40">
                  🧸
                </div>
                <h4 className="text-xl font-black mb-2 text-white">Age-Adaptive</h4>
                <p className="text-sm text-white/80 font-medium leading-relaxed">
                  Smart vocabulary tuned precisely from toddlers (0-2) to school ages (5-8).
                </p>
              </div>
              <span className="mt-4 inline-block text-xs font-black uppercase tracking-wider text-pink-300">
                📖 Smart Learning
              </span>
            </motion.div>

            <motion.div
              whileHover={{ y: -8, scale: 1.03 }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-6 rounded-3xl border-2 border-white/30 hover:border-cyan-300 transition-all shadow-md text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-400/30 flex items-center justify-center text-cyan-300 text-2xl mb-4 border border-cyan-300/40">
                  <FaGlobe />
                </div>
                <h4 className="text-xl font-black mb-2 text-white">6 Languages</h4>
                <p className="text-sm text-white/80 font-medium leading-relaxed">
                  Bilingual story reading and audio narration in English, Spanish, French, and more.
                </p>
              </div>
              <span className="mt-4 inline-block text-xs font-black uppercase tracking-wider text-cyan-300">
                🌍 Global Stories
              </span>
            </motion.div>

            <motion.div
              whileHover={{ y: -8, scale: 1.03 }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-6 rounded-3xl border-2 border-white/30 hover:border-emerald-300 transition-all shadow-md text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-400/30 flex items-center justify-center text-emerald-300 text-2xl mb-4 border border-emerald-300/40">
                  <FaPrint />
                </div>
                <h4 className="text-xl font-black mb-2 text-white">Printable Art</h4>
                <p className="text-sm text-white/80 font-medium leading-relaxed">
                  Generate instant PDF coloring books so your kids can bring stories to life with crayons!
                </p>
              </div>
              <span className="mt-4 inline-block text-xs font-black uppercase tracking-wider text-emerald-300">
                🖍️ Hands-On Art
              </span>
            </motion.div>
          </div>

          {/* Interactive CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-4">
            <NavLink to="/create">
              <motion.button
                whileHover={{ scale: 1.06, backgroundColor: "#FFD700" }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-kidYellow text-[#5253A3] text-xl font-black rounded-full shadow-2xl border-4 border-white transition-all flex items-center gap-2"
              >
                <span>Start Creating Magic</span>
                <HiSparkles className="text-2xl text-[#FF4E98]" />
              </motion.button>
            </NavLink>
            <NavLink to="/explore">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white text-xl font-extrabold rounded-full border-4 border-white/60 shadow-xl backdrop-blur-md transition-colors"
              >
                Browse Story Library 📚
              </motion.button>
            </NavLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
