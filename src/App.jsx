import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import StoryGenerator from "./components/StoryGenerator";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import GeneratedBooks from "./components/GeneratedBooks";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import toast, { Toaster } from "react-hot-toast";

const MagicalCursor = () => {
  useEffect(() => {
    let lastTime = 0;
    const handleMouseMove = (e) => {
      if (Date.now() - lastTime < 50) return; // Throttle creation
      lastTime = Date.now();
      
      const star = document.createElement("div");
      star.className = "pointer-events-none fixed z-[9999] text-xl drop-shadow-md";
      star.style.left = `${e.clientX}px`;
      star.style.top = `${e.clientY}px`;
      star.innerHTML = "✨";
      star.style.transition = "all 1s ease-out";
      document.body.appendChild(star);
      
      requestAnimationFrame(() => {
        star.style.transform = `translateY(40px) scale(0)`;
        star.style.opacity = "0";
      });

      setTimeout(() => star.remove(), 1000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  return null;
};

const App = () => {
  const [generatedStories, setGeneratedStories] = useState([]);
  const [user, setUser] = useState(null);
  const [achievements, setAchievements] = useState([]);

  // Load achievements from localStorage
  useEffect(() => {
    const storedAchievements = JSON.parse(localStorage.getItem("kiddoAchievements")) || [];
    setAchievements(storedAchievements);
  }, []);

  const unlockAchievement = (id, name, icon) => {
    if (achievements.find(a => a.id === id)) return;
    const newAchievement = { id, name, icon, date: new Date().toLocaleDateString() };
    const updated = [...achievements, newAchievement];
    setAchievements(updated);
    localStorage.setItem("kiddoAchievements", JSON.stringify(updated));
    
    toast.success(`New Badge Earned: ${name}!`, {
      icon: icon,
      style: {
        borderRadius: '20px',
        background: '#5253A3',
        color: '#fff',
      },
    });
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("kiddoUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // 30-Minute Auto-Logout Logic
  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      if (user) {
        timeout = setTimeout(() => {
          handleLogout();
          toast("Session expired. Please login again.", { icon: "🔒" });
        }, 30 * 60 * 1000); // 30 minutes
      }
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [user]);

  const handleLogin = (name) => {
    const newUser = { name, credits: 5 };
    setUser(newUser);
    localStorage.setItem("kiddoUser", JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("kiddoUser");
  };

  const spendCredit = () => {
    if (user && user.credits > 0) {
      const updatedUser = { ...user, credits: user.credits - 1 };
      setUser(updatedUser);
      localStorage.setItem("kiddoUser", JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const refillCredits = () => {
    if (user) {
      const updatedUser = { ...user, credits: 5 };
      setUser(updatedUser);
      localStorage.setItem("kiddoUser", JSON.stringify(updatedUser));
      
      // Add visual feedback
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF9EBB', '#FFD05B', '#5253A3']
      });
      toast.success("🪄 Magic Dust Refilled! You have 5 Dusts now.", {
        icon: '✨',
        style: {
          borderRadius: '20px',
          background: '#5253A3',
          color: '#fff',
          fontWeight: 'bold',
        },
      });
    }
  };

  // Function to update generated stories and save them to localStorage
  const updateGeneratedStories = (newStories) => {
    setGeneratedStories(newStories);
    localStorage.setItem("generatedStories", JSON.stringify(newStories)); // Save to localStorage
  };

  // Load stories from localStorage and check for shared magic links
  useEffect(() => {
    const storedStories = JSON.parse(localStorage.getItem("generatedStories")) || [];
    
    // Check for Magic Share Link in URL
    const urlParams = new URLSearchParams(window.location.search);
    const magic = urlParams.get('magic');
    if (magic) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(magic)));
        const sharedStory = {
          title: decoded.t,
          subject: decoded.s,
          text: decoded.tx,
          englishText: decoded.et,
          imageUrl: decoded.i,
          language: decoded.l,
          isShared: true
        };
        
        // Check if already in stories
        if (!storedStories.find(s => s.text === sharedStory.text)) {
          const updated = [sharedStory, ...storedStories];
          setGeneratedStories(updated);
          localStorage.setItem("generatedStories", JSON.stringify(updated));
          toast.success("✨ A shared magic story has been added to your library!");
          unlockAchievement("receiver", "Gift of Story", "🎁");
        }
        
        // Clean URL
        window.history.replaceState({}, document.title, "/explore");
      } catch (e) {
        console.error("Failed to decode magic link", e);
      }
    } else {
      setGeneratedStories(storedStories);
    }
  }, []);

  return (
    <div className="bg-[#CAD3FF] min-h-screen w-full overflow-x-hidden relative">
      <Toaster position="top-center" reverseOrder={false} />
      <MagicalCursor />
      <Router>
        <Navbar user={user} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/create"
            element={
              user ? (
                <StoryGenerator 
                  updateGeneratedStories={updateGeneratedStories} 
                  user={user} 
                  spendCredit={spendCredit} 
                  refillCredits={refillCredits}
                  unlockAchievement={unlockAchievement}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/explore"
            element={<GeneratedBooks generatedStories={generatedStories} updateGeneratedStories={updateGeneratedStories} unlockAchievement={unlockAchievement} />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} generatedStories={generatedStories} refillCredits={refillCredits} achievements={achievements} /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
