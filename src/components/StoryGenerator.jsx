import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from "framer-motion";
import useSound from 'use-sound';
import toast from "react-hot-toast";
import { HiSparkles } from "react-icons/hi";
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

const StoryGenerator = ({ updateGeneratedStories, user, spendCredit, refillCredits, unlockAchievement }) => {
  const [playPop] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playMagic] = useSound('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', { volume: 0.5 });

  const [childName, setChildName] = useState("");
  const [subject, setSubject] = useState("");
  const [storyType, setStoryType] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [storyTone, setStoryTone] = useState(""); 
  const [storyTheme, setStoryTheme] = useState(""); 
  const [storyLength, setStoryLength] = useState("");
  const [language, setLanguage] = useState("English");
  const [story, setStory] = useState("");
  const [generatedStories, setGeneratedStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [apiKey, setApiKey] = useState("");
  
  // Hero Creator State
  const [heroTraits, setHeroTraits] = useState({
    type: "human",
    appearance: "",
    personality: "brave",
    outfit: ""
  });

  const generateStory = async (
  subject,
  storyType,
  ageGroup,
  storyTone,
  storyTheme,
  storyLength,
  childName
) => {
  try {
    setLoading(true);

    const finalApiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

    if (!finalApiKey) {
      toast.error("Please enter your Google Generative AI API Key.");
      return;
    }

    let wordCount = 500;
    if (storyLength === "short") wordCount = 200;
    if (storyLength === "long") wordCount = 800;

    const heroPromptPart = childName
      ? `Make sure the main character is named ${childName}.`
      : "";

    const characterConsistency = `
      The character is a ${heroTraits.type} who is ${heroTraits.personality}.
      They have ${heroTraits.appearance} and are wearing ${heroTraits.outfit}.
      Maintain this same character throughout the story and visuals.
    `;

    const prompt = `
Create a ${wordCount}-word ${storyType} story about ${subject}.
${heroPromptPart}
${characterConsistency}
Tone: ${storyTone}
Theme: ${storyTheme}
Use simple words suitable for children aged ${ageGroup}.
Write the story in ${language}.
Return ONLY valid JSON.
{
  "title": "Story title",
  "story": "Full story",
  "englishStory": "English translation if needed",
  "coverImagePrompt": "Detailed Disney Pixar style children storybook illustration prompt",
  "pageImagePrompts": [
    "Page 1 image prompt",
    "Page 2 image prompt"
  ],
  "quiz": [
    {
      "question": "Question?",
      "options": ["A","B","C","D"],
      "answer": "A"
    }
  ]
}
`;

    const genAI = new GoogleGenerativeAI(finalApiKey);
    
    // Model names
    const PRIMARY_MODEL = "gemini-2.0-flash";
    const FALLBACK_MODEL = "gemini-1.5-flash";

    let result;
    try {
      const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
      result = await model.generateContent(prompt);
    } catch (error) {
      // If primary model is unavailable (503), try the fallback model
      if (error.message?.includes("503") || error.message?.includes("UNAVAILABLE")) {
        console.warn(`Primary model ${PRIMARY_MODEL} unavailable, trying ${FALLBACK_MODEL}...`);
        const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL });
        result = await fallbackModel.generateContent(prompt);
      } else {
        throw error; // Rethrow other errors
      }
    }

    // Move the generation call up before the clean response part
    // (Already moved into the try-catch block above)
    // const result = await model.generateContent(prompt); 

    let responseText = result.response.text();

    // CLEAN RESPONSE
    responseText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("RAW RESPONSE:", responseText);

    const parsedData = JSON.parse(responseText);

    const newStory = parsedData.story;

    // BETTER IMAGE PROMPT
    const imagePrompt =
      parsedData.coverImagePrompt ||
      `Cute children storybook illustration about ${subject}, disney pixar style`;

    // WORKING IMAGE URL
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      imagePrompt
    )}?width=1024&height=1024&seed=${Date.now()}&model=flux&nologo=true`;

    console.log("IMAGE URL:", imageUrl);

    // PRELOAD IMAGE TO VERIFY
    const testImage = new Image();

    testImage.src = imageUrl;

    testImage.onload = () => {
      console.log("Image loaded successfully");
    };

    testImage.onerror = () => {
      console.log("Image failed to load");
      toast.error("Image generation failed.");
    };

    const storyObject = {
      subject,
      storyType,
      ageGroup,
      storyTone,
      storyTheme,
      title: parsedData.title || subject,
      text: newStory,
      englishText: parsedData.englishStory || newStory,
      pageImagePrompts: parsedData.pageImagePrompts || [],
      childName,
      imageUrl,
      quiz: parsedData.quiz || [],
      language,
      heroTraits,
    };

    setStory(newStory);

    setGeneratedStories((prevStories) => {
      const updatedStories = [...prevStories, storyObject];

      localStorage.setItem(
        "generatedStories",
        JSON.stringify(updatedStories)
      );

      return updatedStories;
    });

    setShowPopup(true);

    unlockAchievement("first_story", "Author", "✍️");

    if (language !== "English") {
      unlockAchievement("polyglot", "Language Learner", "🌍");
    }
  } catch (error) {
    console.error("ERROR:", error);

    toast.error(
      error.message || "Failed to generate story or image."
    );
  } finally {
    setLoading(false);
  }
};
  // useEffect(() => {
  //   const storedStories =
  //     JSON.parse(localStorage.getItem("generatedStories")) || demoStories;
  //   setGeneratedStories(storedStories);
  //   updateGeneratedStories(storedStories); 

  //   const storedApiKey = localStorage.getItem("geminiApiKey");
  //   if (storedApiKey) {
  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
    localStorage.setItem("geminiApiKey", e.target.value);
  };

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
    if (!spendCredit()) {
      toast.error("You are out of Magic Dust! Please refill your credits.");
      return;
    }
    playMagic();
    generateStory(subject, storyType, ageGroup, storyTone, storyTheme, storyLength, childName);
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
    playPop();
    setStoryTheme(theme);
  };

  const storyLengths = [
    { value: "short", label: "Short (Bedtime Quickie)", emoji: "⏳" },
    { value: "medium", label: "Medium (Standard)", emoji: "📖" },
    { value: "long", label: "Long (Epic Adventure)", emoji: "🏰" },
  ];

 

  return (
    <div className="bg-[#CAD3FF] min-h-screen font-sans pb-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-10"
      >
        <h1 className="text-center text-5xl font-extrabold py-5 text-[#5253A3] uppercase drop-shadow-sm">
          Create your story ✨
        </h1>
        <p className="text-[#5253A3] px-10 text-center text-xl max-w-2xl mx-auto">
          Unlock your creativity with AI: Craft stories like never before! Let our
          AI bring your imagination to life, one story at a time.
        </p>
      </motion.div>
      {loading && <Loader />}
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
      <form onSubmit={handleSubmit} className="py-6 px-10">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-center mb-12 mt-8 bg-white/40 p-8 rounded-[3rem] shadow-sm max-w-4xl mx-auto backdrop-blur-md border-2 border-white"
        >
            <h1 className="text-2xl font-bold py-2 text-[#5253A3]">
              Got a Gemini API Key? 🔑
            </h1>
            <p className="text-[#5253A3] text-lg mb-6">
              (Optional if you already added it to your .env file)
            </p>
            <input
              type="password"
              placeholder="Your Gemini API Key"
              value={apiKey}
              onChange={handleApiKeyChange}
              className="bg-white w-full max-w-[600px] p-5 rounded-3xl outline-none text-xl shadow-lg border-4 border-transparent focus:border-kidPink transition text-center"
            />
            <p className="text-[#5253A3] text-sm mt-4 font-semibold">
              Don't have one? Get it from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-kidPink">Google AI Studio</a>.
            </p>
          </motion.div>

        <div className="flex flex-col xl:flex-row items-stretch justify-center gap-12 px-10 xl:px-36 mb-16">
          <motion.div 
            initial={{ x: -50, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ delay: 0.3 }} 
            className="text-center flex flex-col bg-white/50 p-8 rounded-[3rem] border-4 border-white shadow-xl backdrop-blur-md xl:w-1/2"
          >
            <h1 className="text-2xl font-black mb-6 text-[#5253A3]">Story Settings 📝</h1>
            <div className="flex flex-col gap-6 w-full h-full justify-between">
              <div>
                <h1 className="text-2xl font-bold py-2 text-[#5253A3]">Language</h1>
                <select
                  value={language}
                  onChange={(e) => { playPop(); setLanguage(e.target.value); }}
                  className="bg-white w-[350px] md:w-[450px] rounded-3xl outline-none p-4 text-lg shadow-lg border-4 border-transparent focus:border-kidBlue transition"
                >
                  <option value="English">English 🇬🇧</option>
                  <option value="Spanish">Spanish 🇪🇸</option>
                  <option value="French">French 🇫🇷</option>
                  <option value="Hindi">Hindi 🇮🇳</option>
                  <option value="German">German 🇩🇪</option>
                  <option value="Japanese">Japanese 🇯🇵</option>
                </select>
              </div>
              <div>
                <h1 className="text-2xl font-bold py-2 text-[#5253A3]">Child's Name (Optional)</h1>
                <input
                  type="text"
                  placeholder="E.g., Benny, Emma..."
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="bg-white w-[350px] md:w-[450px] rounded-3xl outline-none p-4 text-lg shadow-lg border-4 border-transparent focus:border-kidYellow transition"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold py-2 text-[#5253A3]">
                  Subject of the story
                </h1>
                <textarea
                  type="text"
                  placeholder="E.g., A brave little toaster exploring the kitchen..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-white w-[350px] md:w-[450px] h-[200px] rounded-3xl outline-none p-6 text-xl shadow-lg border-4 border-transparent focus:border-kidBlue transition resize-none"
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ delay: 0.4 }} 
            className="text-center bg-white/50 p-8 rounded-[3rem] border-4 border-white shadow-xl backdrop-blur-md"
          >
            <h1 className="text-2xl font-black mb-6 text-[#5253A3]">Design Your Hero 🧙‍♂️</h1>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#5253A3]">Hero Type</label>
                <select 
                  value={heroTraits.type} 
                  onChange={(e) => setHeroTraits({...heroTraits, type: e.target.value})}
                  className="p-3 rounded-2xl bg-white outline-none border-2 border-transparent focus:border-kidPink shadow-sm"
                >
                  <option value="human">Human Boy/Girl</option>
                  <option value="animal">Cute Animal</option>
                  <option value="fantasy">Magical Creature</option>
                  <option value="robot">Friendly Robot</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#5253A3]">Personality</label>
                <select 
                  value={heroTraits.personality} 
                  onChange={(e) => setHeroTraits({...heroTraits, personality: e.target.value})}
                  className="p-3 rounded-2xl bg-white outline-none border-2 border-transparent focus:border-kidPink shadow-sm"
                >
                  <option value="brave">Brave</option>
                  <option value="funny">Funny</option>
                  <option value="curious">Curious</option>
                  <option value="kind">Kind</option>
                  <option value="magical">Magical</option>
                </select>
              </div>
              <div className="col-span-2 flex flex-col gap-2">
                <label className="font-bold text-[#5253A3]">Appearance (Hair, Eyes...)</label>
                <input 
                  type="text" 
                  placeholder="E.g., Golden hair and big green eyes" 
                  value={heroTraits.appearance}
                  onChange={(e) => setHeroTraits({...heroTraits, appearance: e.target.value})}
                  className="p-3 rounded-2xl bg-white outline-none border-2 border-transparent focus:border-kidPink shadow-sm"
                />
              </div>
              <div className="col-span-2 flex flex-col gap-2">
                <label className="font-bold text-[#5253A3]">Favorite Outfit</label>
                <input 
                  type="text" 
                  placeholder="E.g., A red cape and blue boots" 
                  value={heroTraits.outfit}
                  onChange={(e) => setHeroTraits({...heroTraits, outfit: e.target.value})}
                  className="p-3 rounded-2xl bg-white outline-none border-2 border-transparent focus:border-kidPink shadow-sm"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-center px-10 mt-16">
          <h1 className="text-4xl font-black mb-10 text-[#5253A3]">
            What kind of story? 📖
          </h1>
          <div className="flex flex-wrap justify-center gap-10">
            {storyTypes.map((type) => (
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                key={type.value}
                onClick={() => handleStorySelect(type.value)}
                className={`cursor-pointer p-6 w-[250px] h-[350px] flex items-center justify-center rounded-[3rem] shadow-2xl transition-all duration-500 ${
                  storyType === type.value
                    ? "ring-[12px] ring-kidPink ring-offset-8 ring-offset-[#CAD3FF] grayscale-0 scale-105"
                    : "grayscale hover:grayscale-[50%]"
                }`}
                style={{
                  backgroundImage: `url(${type.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}>
                <span className="text-lg font-black text-white bg-black/50 px-6 py-2 rounded-full mt-[240px] backdrop-blur-md border-2 border-white/30">
                  {type.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>


        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-center mt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold py-5 text-[#5253A3]">
              Select Age Group
            </h1>
            <div className="flex flex-wrap justify-center gap-6">
              {ageGroups.map((group) => (
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  key={group.value}
                  onClick={() => handleAgeSelect(group.value)}
                  className={`cursor-pointer p-6 w-[180px] h-[250px] flex items-center justify-center rounded-3xl shadow-xl transition-all duration-300
              ${
                ageGroup === group.value
                  ? "ring-8 ring-kidYellow ring-offset-4 ring-offset-[#CAD3FF] grayscale-0"
                  : "grayscale hover:grayscale-[50%]"
              }
             `}
                  style={{
                    backgroundImage: `url(${group.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}>
                  <span className="text-lg font-extrabold text-white bg-black/40 px-3 py-1 rounded-full mt-[180px] backdrop-blur-sm">
                    {group.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="flex justify-center mt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold py-5 text-[#5253A3]">
              Story Tone
            </h1>
            <div className="flex flex-wrap justify-center gap-6">
              {storyTones.map((tone) => (
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  key={tone.value}
                  onClick={() => handleToneSelect(tone.value)}
                  className={`cursor-pointer p-6 w-[180px] h-[250px] flex items-center justify-center rounded-3xl shadow-xl transition-all duration-300
                  ${
                    storyTone === tone.value
                      ? "ring-8 ring-kidBlue ring-offset-4 ring-offset-[#CAD3FF] grayscale-0"
                      : "grayscale hover:grayscale-[50%]"
                  }`}
                  style={{
                    backgroundImage: `url(${tone.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}>
                  <span className="text-lg font-extrabold text-white bg-black/40 px-3 py-1 rounded-full mt-[180px] backdrop-blur-sm">{tone.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="flex justify-center mt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold py-5 text-[#5253A3]">
              Story Theme
            </h1>
            <div className="flex flex-wrap justify-center gap-6">
              {storyThemes.map((theme) => (
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  key={theme.value}
                  onClick={() => handleThemeSelect(theme.value)}
                  className={`cursor-pointer p-6 w-[180px] h-[250px] flex items-center justify-center rounded-3xl shadow-xl transition-all duration-300
                  ${
                    storyTheme === theme.value
                      ? "ring-8 ring-kidGreen ring-offset-4 ring-offset-[#CAD3FF] grayscale-0"
                      : "grayscale hover:grayscale-[50%]"
                  }`} style={{
                    backgroundImage: `url(${theme.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}>
                  <span className="text-lg font-extrabold text-white bg-black/40 px-3 py-1 rounded-full mt-[180px] backdrop-blur-sm">{theme.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.75 }} className="flex justify-center mt-16">
          <div className="text-center w-full max-w-4xl mx-auto px-10">
            <h1 className="text-2xl font-bold py-5 text-[#5253A3]">
              Story Length
            </h1>
            <div className="flex flex-wrap justify-center gap-6">
              {storyLengths.map((len) => (
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  key={len.value}
                  onClick={() => { playPop(); setStoryLength(len.value); }}
                  className={`cursor-pointer p-6 w-[250px] flex flex-col items-center justify-center rounded-3xl shadow-xl transition-all duration-300
                  ${
                    storyLength === len.value
                      ? "ring-8 ring-kidPink ring-offset-4 ring-offset-[#CAD3FF] bg-white text-[#5253A3]"
                      : "bg-white/50 text-gray-500 hover:bg-white"
                  }`}
                >
                  <span className="text-5xl mb-4">{len.emoji}</span>
                  <span className="text-xl font-extrabold text-center">{len.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center justify-center mt-16 pb-20">
          {user?.credits > 0 ? (
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#FF9EBB", color: "#5253A3" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-kidYellow px-12 py-5 text-3xl rounded-full text-[#5253A3] font-extrabold shadow-xl border-4 border-white transition-all flex items-center gap-4"
            >
              Generate Story <span className="text-xl bg-white/50 px-4 py-1 rounded-full text-kidPink flex items-center gap-1">-1 <HiSparkles /></span>
            </motion.button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button disabled className="bg-gray-300 px-12 py-5 text-3xl rounded-full text-gray-500 font-extrabold shadow-inner border-4 border-white cursor-not-allowed">
                Out of Magic Dust! 🥲
              </button>
              <button type="button" onClick={refillCredits} className="text-[#5253A3] font-bold hover:text-kidPink text-xl bg-white/80 px-6 py-2 rounded-full border-2 border-white shadow-md transition-colors">
                Refill 5 Magic Dust (Demo)
              </button>
            </div>
          )}
        </motion.div>
      </form>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-white rounded-[3rem] p-10 max-w-lg w-full text-center shadow-2xl border-8 border-kidPink"
          >
            <div className="w-40 h-40 mx-auto mb-6 rounded-2xl overflow-hidden border-4 border-kidYellow shadow-md">
               <img src={generatedStories[generatedStories.length - 1]?.imageUrl} alt="Cover" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-black text-[#5253A3] mb-4">Magic Created! ✨</h1>
            <p className="text-lg text-gray-600 mb-8">Your story "<strong>{generatedStories[generatedStories.length - 1]?.title}</strong>" is ready in your library.</p>
            <div className="flex flex-col gap-4">
              <NavLink 
                to="/explore" 
                onClick={() => setShowPopup(false)} 
                className="bg-kidPink text-white py-4 rounded-full text-xl font-black shadow-lg hover:scale-105 transition"
              >
                Go to Library 📖
              </NavLink>
              <button 
                onClick={() => setShowPopup(false)} 
                className="text-[#5253A3] font-bold text-lg hover:underline"
              >
                Create Another Story
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StoryGenerator;