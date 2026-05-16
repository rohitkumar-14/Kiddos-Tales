import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { HiSparkles } from "react-icons/hi";

const Dashboard = ({ user, generatedStories, refillCredits, achievements }) => {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-start p-6 md:p-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md border-4 border-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl w-full max-w-4xl"
      >
        <h1 className="text-4xl md:text-6xl font-black text-[#5253A3] mb-10 text-center">
          Parent Dashboard 📊
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Credits Card */}
          <div className="bg-gradient-to-br from-white to-pink-50 p-8 rounded-3xl shadow-lg border-2 border-kidPink/30 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold text-gray-500 uppercase tracking-widest mb-2">Magic Dust</h2>
            <p className="text-6xl font-black text-kidPink mb-4 flex items-center gap-2">
              {user?.credits || 0} <HiSparkles />
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refillCredits} 
              className="bg-kidPink text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-pink-500 transition-colors"
            >
              Refill Dust (Demo)
            </motion.button>
          </div>
          
          {/* Stories Card */}
          <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-3xl shadow-lg border-2 border-kidBlue/30 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold text-gray-500 uppercase tracking-widest mb-2">Books Created</h2>
            <p className="text-6xl font-black text-kidBlue mb-4">{generatedStories?.length || 0} 📚</p>
            <NavLink to="/explore">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-kidBlue text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-600 transition-colors"
              >
                View Library
              </motion.button>
            </NavLink>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-black text-[#5253A3] mb-6 text-center">Achievement Gallery 🏆</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {achievements.length > 0 ? (
              achievements.map((achievement) => (
                <motion.div 
                  key={achievement.id}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="bg-white p-4 rounded-2xl shadow-md border-2 border-kidYellow flex flex-col items-center w-32"
                >
                  <span className="text-4xl mb-2">{achievement.icon}</span>
                  <p className="text-xs font-bold text-[#5253A3] text-center uppercase">{achievement.name}</p>
                </motion.div>
              ))
            ) : (
              <div className="bg-white/50 p-6 rounded-2xl border-2 border-dashed border-[#5253A3]/30 text-center w-full">
                <p className="text-[#5253A3] opacity-60 font-bold">No badges yet! Start your magic journey to earn some. ✨</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 p-6 bg-white/50 rounded-2xl border-2 border-white text-center">
          <p className="text-[#5253A3] font-medium italic">
            "Every story is a new adventure waiting to be explored!"
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
