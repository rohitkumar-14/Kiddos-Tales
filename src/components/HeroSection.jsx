import { NavLink } from "react-router-dom";
import hero from "../assets/hero.webp";
import Footer from "./Footer";
import AboutSection from "./AboutSection";
import { motion } from "framer-motion";
import ImageWithSkeleton from "./common/ImageWithSkeleton";

const HeroSection = () => {
  return (
    <>
    <div className="relative flex flex-col md:flex-row items-center justify-between p-8 min-h-[90vh] overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF4E98] rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-kidYellow rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#00D2FF] rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="md:w-1/2 px-10 md:px-20 z-10"
      >
        <div className="inline-block bg-white/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white mb-6 shadow-sm">
          <span className="text-kidPink font-extrabold text-lg">✨ Now with AI Coloring Books & Quizzes!</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-6 text-[#5253A3] leading-tight drop-shadow-sm">
          Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4E98] to-[#00D2FF] drop-shadow-md">Magic</span> <br/> Meets Reading
        </h1>
        <p className="text-xl md:text-2xl text-[#5253A3] mt-4 font-bold max-w-lg leading-relaxed opacity-90">
          Turn your child into the hero of their own fully illustrated, multilingual adventure. Includes read-aloud audiobooks and printable coloring pages!
        </p>
        <div className="flex gap-4 mt-10">
          <NavLink to="/create">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "#8081d8" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#5253A3] text-white rounded-full text-xl font-bold shadow-2xl border-4 border-white transition-colors">
              Start Creating ✨
            </motion.button>
          </NavLink>
          <NavLink to="/explore">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-[#5253A3] rounded-full text-xl font-bold shadow-xl border-4 border-[#5253A3] hover:bg-gray-50 transition-colors">
              Read Library 📚
            </motion.button>
          </NavLink>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="md:w-1/2 flex justify-center px-10 mt-16 md:mt-0 z-10"
      >
        {/* Bento Grid Style Hero Graphics */}
        <div className="relative w-full max-w-lg">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-kidPink absolute -top-10 -left-10 z-20 rotate-[-5deg]">
             <h3 className="text-2xl font-black text-kidPink">Bilingual! 🌍</h3>
             <p className="font-bold text-gray-500">Read in 6 languages</p>
          </motion.div>
          
          <ImageWithSkeleton 
            src={hero} 
            alt="Kids Reading" 
            loading="eager"
            containerClassName="w-full aspect-square drop-shadow-2xl rounded-[3rem] border-8 border-white bg-white/40"
            className="w-full h-full object-cover" 
            fallbackIcon="📚"
          />
          
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="bg-kidYellow p-6 rounded-3xl shadow-2xl border-4 border-white absolute -bottom-10 -right-10 z-20 rotate-[5deg]">
             <h3 className="text-2xl font-black text-[#5253A3]">Coloring Pages 🖍️</h3>
             <p className="font-bold text-[#5253A3] opacity-80">Print & Color!</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
    <AboutSection />
    <Footer />
    </>
  );
};

export default HeroSection;
