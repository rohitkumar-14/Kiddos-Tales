import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg"

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4  text-[#5253A3]">
      <div className="text-xl font-bold pl-16">
        <NavLink to="/" className="hover:text-[#263371] flex items-center gap-2"><img src={logo} alt="logo"/> <span className="text-2xl">KiddoTales</span></NavLink>
      </div>
      <div className="flex space-x-6">
        <NavLink to="/" className="text-2xl font-semibold hover:text-[#263371]">Home</NavLink>
        <NavLink to="/create" className="text-2xl font-semibold hover:text-[#263371]">Create Story</NavLink>
        <NavLink to="/explore" className="text-2xl font-semibold hover:text-[#263371]">Explore Stories</NavLink>
      </div>

      <div className="mr-16">
        <NavLink to='/create'>
        <button className="px-4 py-2 bg-[#5253A3] rounded-lg hover:bg-[#8081d8]">
          Get Started
        </button>
        </NavLink>
        
      </div>
    </nav>
  );
};

export default Navbar;
