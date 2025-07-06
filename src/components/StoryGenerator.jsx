import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import storyBook from "../assets/story.png";
import bedStory from "../assets/bedstory.png";
import educationalStory from "../assets/educational.png";
import twoAge from "../assets/02Years.png";
import fiveAge from "../assets/35Years.png";
import eightAge from "../assets/58Years.png";
import Loader from "./Loader";
import Popup from "./Popup";
import Adventurous from "../assets/Adventurous.jpg"
import Exciting from "../assets/Exciting.avif"
import Funny from "../assets/Funny.jpg"
import Magical from "../assets/Magical.jpg"
import Calm from "../assets/calm.avif"
import Friendship from "../assets/Friendship.avif"
import Bravery from "../assets/Bravery.avif"
import Discovery from "../assets/Discovery.avif"
import Nature from "../assets/Nature.avif"
import Family from "../assets/Family.avif"
import { demoStories } from "../data/demoStories";

const StoryGenerator = ({ updateGeneratedStories }) => {
  const [subject, setSubject] = useState("");
  const [storyType, setStoryType] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [storyTone, setStoryTone] = useState(""); 
  const [storyTheme, setStoryTheme] = useState(""); 
  const [story, setStory] = useState("");
  const [generatedStories, setGeneratedStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const generateStory = async (subject, storyType, ageGroup, storyTone, storyTheme) => {
    if (!apiKey) {
      alert("Please enter your Google Generative AI API Key.");
      return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Updated prompt to include tone and theme
    const prompt = `Create a 600-word ${storyType} about a ${subject}. The story should have a ${storyTone} tone and explore the theme of ${storyTheme}. Use simple words and short sentences suitable for children aged ${ageGroup}.`;

    try {
      setLoading(true);
      const result = await model.generateContent(prompt);
      const newStory = result.response.text();
      setStory(newStory);
      const storyObject = { subject, storyType, ageGroup, storyTone, storyTheme, text: newStory };
      setGeneratedStories((prevStories) => {
        const updatedStories = [...prevStories, storyObject];
        updateGeneratedStories(updatedStories);
        localStorage.setItem(
          "generatedStories",
          JSON.stringify(updatedStories)
        );
        return updatedStories;
      });
      setLoading(false);
      setShowPopup(true);
    } catch (error) {
      console.error("Error generating story:", error);
      setLoading(false);
      alert("Failed to generate story. Please check your API key and try again.");
    }
  };

  // useEffect(() => {
  //   const storedStories =
  //     JSON.parse(localStorage.getItem("generatedStories")) || demoStories;
  //   setGeneratedStories(storedStories);
  //   updateGeneratedStories(storedStories); 

  //   const storedApiKey = localStorage.getItem("geminiApiKey");
  //   if (storedApiKey) {
  //     setApiKey(storedApiKey);
  //   }
  // }, []);
  
  
  
  useEffect(() => {
    let storedStories = [];
  
    try {
      const raw = localStorage.getItem("generatedStories");
  
      if (raw) {
        storedStories = JSON.parse(raw);
      } else {
        storedStories = demoStories;
        localStorage.setItem("generatedStories", JSON.stringify(demoStories));
      }
    } catch (error) {
      console.error("Error reading or parsing generatedStories:", error);
      storedStories = demoStories;
      localStorage.setItem("generatedStories", JSON.stringify(demoStories));
    }
  
    setGeneratedStories(storedStories);
    updateGeneratedStories(storedStories);
  
    // Load stored API key if available
    const storedApiKey = localStorage.getItem("geminiApiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    generateStory(subject, storyType, ageGroup, storyTone, storyTheme);
  };

  const storyTypes = [
    { value: "storybook", label: "Story Book", imageUrl: storyBook },
    { value: "bed story", label: "Bed Story", imageUrl: bedStory },
    { value: "educational", label: "Educational", imageUrl: educationalStory },
  ];

  const handleStorySelect = (type) => {
    setStoryType(type);
  };

  const ageGroups = [
    { value: "0-2", label: "0-2 years", imageUrl: twoAge },
    { value: "3-5", label: "3-5 years", imageUrl: fiveAge },
    { value: "5-8", label: "5-8 years", imageUrl: eightAge },
  ];

  const handleAgeSelect = (group) => {
    setAgeGroup(group);
  };

  const storyTones = [
    { value: "funny", label: "Funny", imageUrl: Funny },
    { value: "adventurous", label: "Adventurous", imageUrl: Adventurous },
    { value: "calm", label: "Calm", imageUrl: Calm },
    { value: "exciting", label: "Exciting", imageUrl: Exciting },
    { value: "magical", label: "Magical", imageUrl: Magical },
  ];

  const handleToneSelect = (tone) => {
    setStoryTone(tone);
  };

  const storyThemes = [
    { value: "friendship", label: "Friendship", imageUrl: Friendship },
    { value: "bravery", label: "Bravery", imageUrl: Bravery },
    { value: "discovery", label: "Discovery", imageUrl: Discovery },
    { value: "nature", label: "Nature", imageUrl: Nature },
    { value: "family", label: "Family", imageUrl: Family },
  ];

  const handleThemeSelect = (theme) => {
    setStoryTheme(theme);
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
    localStorage.setItem("geminiApiKey", e.target.value);
  };

  return (
    <div className="bg-[#CAD3FF]">
      <h1 className="text-center text-6xl font-bold py-5 text-[#5253A3] uppercase">
        Create your story
      </h1>
      <p className="text-[#5253A3] px-10 text-center">
        Unlock your creativity with AI: Craft stories like never before! Let our
        AI bring your imagination to life, one story at a time.
      </p>
      {loading && <Loader />}
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
      <form onSubmit={handleSubmit} className="py-6 px-10">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold py-5 text-[#5253A3]">
              Enter your Google Generative AI API Key
            </h1>
            <input
              type="password"
              placeholder="Your Gemini API Key"
              value={apiKey}
              onChange={handleApiKeyChange}
              className="bg-white w-[600px] p-4 rounded-2xl outline-none text-2xl"
            />
            <p className="text-[#5253A3] text-sm mt-2">
              You can get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>.
            </p>
          </div>

        <div className="flex items-center justify-between px-36">
          <div className="text-center h-[380px]">
            <h1 className="text-3xl font-bold py-5 text-[#5253A3]">
              Subject of the story
            </h1>
            <textarea
              type="text"
              placeholder="Enter the subject of the story"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white w-[450px] h-[300px] rounded-2xl outline-none p-4 text-2xl"
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold py-5 text-[#5253A3]">
              Story Type
            </h1>
            <div className="flex justify-center space-x-4">
              {storyTypes.map((type) => (
                <div
                  key={type.value}
                  onClick={() => handleStorySelect(type.value)}
                  className={`cursor-pointer p-6 w-[200px] h-[300px] flex items-center justify-center rounded-xl shadow-md hover:shadow-lg transition grayscale hover:grayscale-0 hover:transition hover:duration-300 hover:outline hover:outline-4 hover:outline-offset-8 hover:outline-[#5253A3] ${
                    storyType === type.value
                      ? "border-4 border-[#5253A3] bg-[#5253A3] text-white grayscale-0"
                      : "bg-white text-[#5253A3]"
                  }`}
                  style={{
                    backgroundImage: `url(${type.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}>
                  <span className="text-2xl font-semibold text-white p-2 rounded mt-[200px]">
                    {type.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-36 mt-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold py-5 text-[#5253A3]">
              Select Age Group
            </h1>
            <div className="flex justify-center space-x-4">
              {ageGroups.map((group) => (
                <div
                  key={group.value}
                  onClick={() => handleAgeSelect(group.value)}
                  className={`cursor-pointer p-6 w-[200px] h-[300px] flex items-center justify-center rounded-xl shadow-md hover:shadow-lg transition grayscale hover:grayscale-0 hover:transition hover:duration-300 hover:outline hover:outline-4 hover:outline-offset-8 hover:outline-[#5253A3]
              ${
                ageGroup === group.value
                  ? "border-4 border-[#5253A3] bg-[#5253A3] text-white grayscale-0"
                  : "bg-white text-[#5253A3]"
              }
             `}
                  style={{
                    backgroundImage: `url(${group.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}>
                  <span className="text-2xl font-semibold text-white p-2 rounded mt-[200px]">
                    {group.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          
        </div>
        <div className="flex items-center justify-between px-36 mt-8">
          {/* Story Tone Selection */}
          <div className="text-center">
            <h1 className="text-3xl font-bold py-5 text-[#5253A3]">
              Story Tone
            </h1>
            <div className="flex justify-center space-x-4">
              {storyTones.map((tone) => (
                <div
                  key={tone.value}
                  onClick={() => handleToneSelect(tone.value)}
                  className={`cursor-pointer p-6 w-[200px] h-[300px] flex items-center justify-center rounded-xl shadow-md hover:shadow-lg transition grayscale hover:grayscale-0 hover:transition hover:duration-300 hover:outline hover:outline-4 hover:outline-offset-8 hover:outline-[#5253A3]
                  ${
                    storyTone === tone.value
                      ? "border-4 border-[#5253A3] bg-[#5253A3] text-white grayscale-0"
                  : "bg-white text-[#5253A3]"
                  }`} style={{
                    backgroundImage: `url(${tone.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}>
                  <span className="text-2xl font-semibold text-white p-2 rounded mt-[200px]">{tone.label}</span>
                </div>
              ))}
            </div>
          </div>
          </div>
        {/* Story Theme Selection */}
        <div className="flex items-center justify-between px-36 mt-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold py-5 text-[#5253A3]">
              Story Theme
            </h1>
            <div className="flex justify-center space-x-4">
              {storyThemes.map((theme) => (
                <div
                  key={theme.value}
                  onClick={() => handleThemeSelect(theme.value)}
                  className={`cursor-pointer p-6 w-[200px] h-[300px] flex items-center justify-center rounded-xl shadow-md hover:shadow-lg transition grayscale hover:grayscale-0 hover:transition hover:duration-300 hover:outline hover:outline-4 hover:outline-offset-8 hover:outline-[#5253A3]
                  ${
                    storyTheme === theme.value
                      ? "border-4 border-[#5253A3] bg-[#5253A3] text-white grayscale-0"
                  : "bg-white text-[#5253A3]"
                  }`} style={{
                    backgroundImage: `url(${theme.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}>
                  <span className="text-2xl font-semibold text-white p-2 rounded mt-[200px]">{theme.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-8">
          <button
            type="submit"
            className="px-6 py-4 text-2xl mt-5 bg-[#5253A3] hover:bg-[#8081d8] rounded">
            Generate Story
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoryGenerator;