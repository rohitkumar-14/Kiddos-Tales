import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import StoryGenerator from "./components/StoryGenerator";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GeneratedBooks from "./components/GeneratedBooks";
import { useState, useEffect } from "react";

const App = () => {
  const [generatedStories, setGeneratedStories] = useState([]);

  // Function to update generated stories and save them to localStorage
  const updateGeneratedStories = (newStories) => {
    setGeneratedStories(newStories);
    localStorage.setItem("generatedStories", JSON.stringify(newStories)); // Save to localStorage
  };

  // Load stories from localStorage when the app initializes
  useEffect(() => {
    const storedStories = JSON.parse(localStorage.getItem("generatedStories")) || [];
    setGeneratedStories(storedStories);
  }, []);

  return (
    <div className="bg-[#CAD3FF] h-screen w-screen overflow-x-hidden">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route
            path="/create"
            element={<StoryGenerator updateGeneratedStories={updateGeneratedStories} />}
          />
          <Route
            path="/explore"
            element={<GeneratedBooks generatedStories={generatedStories} />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
