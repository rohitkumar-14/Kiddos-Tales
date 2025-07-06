import { NavLink } from "react-router-dom";
import hero from "../assets/hero.png";
import FeaturesSection from "./FeaturesSection";
import PaymentSection from "./PaymentSection";
import Footer from "./Footer";

const HeroSection = () => {
  return (
    <>
    <div className="flex flex-col md:flex-row items-center justify-between p-8">
      <div className="md:w-1/2 px-20">
        <h1 className="text-7xl font-bold mb-4 text-[#5253A3] leading-[100px]">
          Craft Magical Stories for Kids in Minutes
        </h1>
        <p className="text-lg text-[#5253A3] mt-4">
          Create fun and personalised stories that bring your child&apos;s
          adventures to life and spark their passion for reading. It only takes
          a few seconds!
        </p>
        <NavLink to="/create">
          <button className="px-4 py-2 mt-5 bg-[#5253A3] hover:bg-[#8081d8] rounded">
            Create Story
          </button>
        </NavLink>
      </div>

      <div className="md:w-1/2 flex justify-center px-20">
        <img src={hero} alt="Kids Reading" className="h-[500px]" />
      </div>
    </div>
    <FeaturesSection />
    <PaymentSection />
    <Footer />
    </>
  );
};

export default HeroSection;
