import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg"
import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi";

const Navbar = ({ user, handleLogout }) => {
  return (
    <nav className="flex items-center justify-between p-4 text-[#5253A3]">
      <div className="text-xl font-bold pl-16">
        <NavLink to="/" className="hover:text-[#263371] flex items-center gap-2">
          <motion.img 
            whileHover={{ rotate: 10, scale: 1.1 }}
            src={logo} alt="logo" 
          /> 
          <span className="text-2xl font-bold">KiddoTales</span>
        </NavLink>
      </div>
      <div className="flex space-x-6">
        <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
          <NavLink to="/" className="text-2xl font-semibold hover:text-[#263371] hover:underline decoration-kidPink decoration-4 underline-offset-4">Home</NavLink>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
          <NavLink to="/create" className="text-2xl font-semibold hover:text-[#263371] hover:underline decoration-kidYellow decoration-4 underline-offset-4">Create Story</NavLink>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
          <NavLink to="/explore" className="text-2xl font-semibold hover:text-[#263371] hover:underline decoration-kidBlue decoration-4 underline-offset-4">Explore Stories</NavLink>
        </motion.div>
      </div>

      <div className="mr-16 flex items-center gap-4 z-50">
        {user ? (
          <>
            <NavLink to="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} className="bg-white/50 px-4 py-2 rounded-full font-bold shadow-sm border-2 border-white flex items-center gap-2 cursor-pointer hover:bg-white/70 transition">
                <span className="text-xl">🧑‍🚀 {user.name}</span>
                <span className="text-xl bg-kidPink text-white px-3 py-1 rounded-full shadow-inner text-sm ml-2 flex items-center gap-1">
                  <HiSparkles /> {user.credits} Dust
                </span>
              </motion.div>
            </NavLink>
            <motion.button 
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-red-400 text-white rounded-full font-bold shadow-lg text-lg">
              Logout
            </motion.button>
          </>
        ) : (
          <NavLink to='/login'>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "#8081d8" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[#5253A3] text-white rounded-full font-bold shadow-lg text-lg">
              Login
            </motion.button>
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
