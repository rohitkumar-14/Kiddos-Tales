import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useSound from "use-sound";

const Login = ({ onLogin }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [playPop] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playMagic] = useSound('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', { volume: 0.5 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      playMagic();
      onLogin(name.trim());
      navigate("/create");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden p-6">
      {/* Background Decor */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-kidPink rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-10 right-10 w-48 h-48 bg-kidYellow rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-48 h-48 bg-kidBlue rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.5, type: "spring" }}
        className="bg-white/40 backdrop-blur-xl border-4 border-white p-10 md:p-16 rounded-[3rem] shadow-2xl text-center max-w-lg w-full z-10"
      >
        <div className="text-6xl mb-6 drop-shadow-md">🚀</div>
        <h1 className="text-4xl font-extrabold text-[#5253A3] mb-4 drop-shadow-sm">Welcome to KiddoTales!</h1>
        <p className="text-xl text-kidBlue font-semibold mb-8">Enter your name to claim your 5 free Magic Dusts 🪄</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Your Name (e.g., Parent, Emma)"
            value={name}
            onChange={(e) => { playPop(); setName(e.target.value); }}
            className="w-full bg-white/70 p-5 rounded-full text-xl shadow-inner border-4 border-transparent focus:border-kidPink outline-none text-center font-bold text-[#5253A3] transition-all"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-kidYellow text-[#5253A3] py-5 rounded-full text-2xl font-extrabold shadow-xl border-4 border-white hover:bg-yellow-300 transition-colors"
          >
            Let's Go! ✨
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
