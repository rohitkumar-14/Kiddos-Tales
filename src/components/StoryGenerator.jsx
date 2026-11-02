import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";
import toast from "react-hot-toast";
import {
  HiSparkles,
  HiMicrophone,
  HiKey,
  HiArrowRight,
  HiArrowLeft,
  HiX,
} from "react-icons/hi";
import { FaDice, FaMagic } from "react-icons/fa";

import storyBook from "../assets/story.webp";
import bedStory from "../assets/bedstory.webp";
import educationalStory from "../assets/educational.webp";
import twoAge from "../assets/02Years.webp";
import fiveAge from "../assets/35Years.webp";
import eightAge from "../assets/58Years.webp";
import Adventurous from "../assets/Adventurous.webp";
import Exciting from "../assets/Exciting.avif";
import Funny from "../assets/Funny.webp";
import Magical from "../assets/Magical.webp";
import Calm from "../assets/calm.avif";
import Friendship from "../assets/Friendship.avif";
import Bravery from "../assets/Bravery.avif";
import Discovery from "../assets/Discovery.avif";
import Nature from "../assets/Nature.avif";
import Family from "../assets/Family.avif";

import Loader from "./Loader";
import Popup from "./Popup";
import SelectableCardWithSkeleton from "./common/SelectableCardWithSkeleton";
import LiveBookPreview from "./common/LiveBookPreview";
import { demoStories } from "../data/demoStories";

const surprisePrompts = [
  {
    name: "Leo",
    subject: "A clumsy baby dragon who accidentally sneezes popcorn instead of fire at the kingdom carnival!",
    type: "storybook",
    age: "3-5",
    tone: "funny",
    theme: "friendship",
    hero: { type: "animal", personality: "funny", appearance: "Bright green scales with purple wings", outfit: "A tiny chef apron" }
  },
  {
    name: "Emma",
    subject: "A curious little astronaut who discovers that the moon is made of glowing marshmallow clouds and floating space bunnies!",
    type: "storybook",
    age: "5-8",
    tone: "adventurous",
    theme: "discovery",
    hero: { type: "human", personality: "curious", appearance: "Curly brown hair with starry eyes", outfit: "Silver rocket boots and helmet" }
  },
  {
    name: "Pip",
    subject: "A tiny field mouse who builds a flying acorn glider to rescue a lost baby bumblebee from a puddle.",
    type: "bed story",
    age: "3-5",
    tone: "calm",
    theme: "bravery",
    hero: { type: "animal", personality: "brave", appearance: "Soft grey fur and big twitchy ears", outfit: "A maple leaf backpack" }
  },
  {
    name: "Nova",
    subject: "A friendly solar-powered robot who teaches sleepy stars how to sing bedtime lullabies to the planets.",
    type: "educational",
    age: "5-8",
    tone: "magical",
    theme: "nature",
    hero: { type: "robot", personality: "kind", appearance: "Shiny blue metal with a heart-shaped screen", outfit: "A yellow propeller cap" }
  },
  {
    name: "Maya",
    subject: "A brave little detective with a magical magnifying glass that reveals happy hidden colors in everyday objects.",
    type: "storybook",
    age: "3-5",
    tone: "exciting",
    theme: "discovery",
    hero: { type: "human", personality: "curious", appearance: "Twin braided pigtails and boots", outfit: "A detective trench coat" }
  }
];

const quickInspirations = [
  { label: "🚀 Space Safari", text: "An astronaut explorer discovering planets made of bouncy jelly" },
  { label: "🦕 Friendly Dino", text: "A baby T-Rex who wants to learn how to play hide-and-seek" },
  { label: "🧁 Candy Bakery", text: "A detective kitten solving the mystery of the missing cupcake sprinkles" },
  { label: "🧜‍♀️ Coral Kingdom", text: "A curious sea turtle on a quest to find the glowing pearl of kindness" },
  { label: "🏰 Flying Books", text: "A secret library where ancient spellbooks sprout wings and flutter" },
];

const StoryGenerator = ({
  updateGeneratedStories,
  user,
  spendCredit,
  refillCredits,
  unlockAchievement,
}) => {
  const [playPop] = useSound("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3", { volume: 0.4 });
  const [playMagic] = useSound("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3", { volume: 0.5 });

  // Wizard Step State (1, 2, 3)
  const [activeStep, setActiveStep] = useState(1);

  // Story Form State
  const [childName, setChildName] = useState("");
  const [subject, setSubject] = useState("");
  const [storyType, setStoryType] = useState("storybook");
  const [ageGroup, setAgeGroup] = useState("3-5");
  const [storyTone, setStoryTone] = useState("adventurous");
  const [storyTheme, setStoryTheme] = useState("friendship");
  const [storyLength, setStoryLength] = useState("medium");
  const [language, setLanguage] = useState("English");
  const [story, setStory] = useState("");
  const [generatedStories, setGeneratedStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [latestGeneratedStory, setLatestGeneratedStory] = useState(null);

  // API Key & Modal State
  const [apiKey, setApiKey] = useState("");
  const [showApiModal, setShowApiModal] = useState(false);

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);

  // Hero Creator State
  const [heroTraits, setHeroTraits] = useState({
    type: "human",
    appearance: "",
    personality: "brave",
    outfit: "",
  });

  const storyTypes = [
    { value: "storybook", label: "Story Book", imageUrl: storyBook, icon: "📖" },
    { value: "bed story", label: "Bed Story", imageUrl: bedStory, icon: "🌙" },
    { value: "educational", label: "Educational", imageUrl: educationalStory, icon: "🎓" },
  ];

  const ageGroups = [
    { value: "0-2", label: "0-2 years", imageUrl: twoAge, icon: "🍼" },
    { value: "3-5", label: "3-5 years", imageUrl: fiveAge, icon: "🧸" },
    { value: "5-8", label: "5-8 years", imageUrl: eightAge, icon: "🚀" },
  ];

  const storyTones = [
    { value: "funny", label: "Funny", imageUrl: Funny, icon: "😂" },
    { value: "adventurous", label: "Adventurous", imageUrl: Adventurous, icon: "🗺️" },
    { value: "calm", label: "Calm", imageUrl: Calm, icon: "☁️" },
    { value: "exciting", label: "Exciting", imageUrl: Exciting, icon: "⚡" },
    { value: "magical", label: "Magical", imageUrl: Magical, icon: "🪄" },
  ];

  const storyThemes = [
    { value: "friendship", label: "Friendship", imageUrl: Friendship, icon: "🤝" },
    { value: "bravery", label: "Bravery", imageUrl: Bravery, icon: "🦁" },
    { value: "discovery", label: "Discovery", imageUrl: Discovery, icon: "🧭" },
    { value: "nature", label: "Nature", imageUrl: Nature, icon: "🌲" },
    { value: "family", label: "Family", imageUrl: Family, icon: "🏡" },
  ];

  const storyLengths = [
    { value: "short", label: "Short (Bedtime Quickie)", emoji: "⏳" },
    { value: "medium", label: "Medium (Standard)", emoji: "📖" },
    { value: "long", label: "Long (Epic Adventure)", emoji: "🏰" },
  ];

  // Load Stored Stories and API Key
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
      console.error("Error reading generatedStories:", error);
      storedStories = demoStories;
      localStorage.setItem("generatedStories", JSON.stringify(demoStories));
    }

    setGeneratedStories(storedStories);
    updateGeneratedStories(storedStories);

    const storedApiKey = localStorage.getItem("geminiApiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
    localStorage.setItem("geminiApiKey", e.target.value);
  };

  // Voice Input via Web Speech API
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser. Try Google Chrome!");
      return;
    }

    if (isListening) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.lang =
        language === "Spanish"
          ? "es-ES"
          : language === "French"
          ? "fr-FR"
          : language === "Hindi"
          ? "hi-IN"
          : "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        toast("Listening for your idea... 🎙️", { icon: "👂" });
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSubject((prev) => (prev ? `${prev} ${transcript}` : transcript));
        toast.success("Got your idea! ✨");
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error("Couldn't hear speech clearly, please try again.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Speech error", err);
      setIsListening(false);
    }
  };

  // Surprise Me Random Prompt Generator
  const handleSurpriseMe = () => {
    playMagic();
    const pick =
      surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)];
    setChildName(pick.name);
    setSubject(pick.subject);
    setStoryType(pick.type);
    setAgeGroup(pick.age);
    setStoryTone(pick.tone);
    setStoryTheme(pick.theme);
    setHeroTraits(pick.hero);
    toast.success("✨ Magic inspiration rolled! Check your preview.", {
      icon: "🎲",
      style: { borderRadius: "20px", background: "#5253A3", color: "#fff" },
    });
  };

  // Step Validation
  const validateStep1 = () => {
    if (!subject.trim()) {
      toast.error("Please enter a story idea or tap '🎲 Surprise Me!'", {
        icon: "💡",
      });
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    playPop();
    if (activeStep === 1) {
      if (!validateStep1()) return;
      setActiveStep(2);
    } else if (activeStep === 2) {
      setActiveStep(3);
    }
  };

  const handlePrevStep = () => {
    playPop();
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  // Generate Story Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    if (!spendCredit()) {
      toast.error("You are out of Magic Dust! Please refill your credits.");
      return;
    }
    playMagic();
    generateStory(
      subject,
      storyType,
      ageGroup,
      storyTone,
      storyTheme,
      storyLength,
      childName
    );
  };

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
        setShowApiModal(true);
        toast.error("Please provide a Gemini API Key to weave stories.");
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
      const PRIMARY_MODEL = "gemini-2.0-flash";
      const FALLBACK_MODEL = "gemini-1.5-flash";

      let result;
      try {
        const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
        result = await model.generateContent(prompt);
      } catch (error) {
        if (
          error.message?.includes("503") ||
          error.message?.includes("UNAVAILABLE")
        ) {
          console.warn(`Primary model ${PRIMARY_MODEL} unavailable, falling back to ${FALLBACK_MODEL}...`);
          const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL });
          result = await fallbackModel.generateContent(prompt);
        } else {
          throw error;
        }
      }

      let responseText = result.response.text();
      responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsedData = JSON.parse(responseText);
      const newStory = parsedData.story;

      const imagePrompt =
        parsedData.coverImagePrompt ||
        `Cute children storybook illustration about ${subject}, disney pixar style`;

      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        imagePrompt
      )}?width=1024&height=1024&seed=${Date.now()}&model=flux&nologo=true`;

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
      setLatestGeneratedStory(storyObject);

      setGeneratedStories((prevStories) => {
        const updatedStories = [...prevStories, storyObject];
        localStorage.setItem("generatedStories", JSON.stringify(updatedStories));
        return updatedStories;
      });

      setShowPopup(true);
      unlockAchievement("first_story", "Author", "✍️");

      if (language !== "English") {
        unlockAchievement("polyglot", "Language Learner", "🌍");
      }
    } catch (error) {
      console.error("ERROR:", error);
      toast.error(error.message || "Failed to generate story or image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#CAD3FF] min-h-screen font-sans pb-20 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#FF4E98] rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-80 right-10 w-96 h-96 bg-kidYellow rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-[#00D2FF] rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {loading && <Loader />}
      {showPopup && (
        <Popup
          story={latestGeneratedStory}
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* Top Floating Utility Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white shadow-sm">
          <HiSparkles className="text-kidPink text-lg" />
          <span className="text-sm font-black text-[#5253A3]">
            Magic Dust: {user?.credits || 0} ✨
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowApiModal(true)}
          className="inline-flex items-center gap-2 bg-white/80 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full border-2 border-white shadow-sm text-xs md:text-sm font-black text-[#5253A3] transition-all hover:scale-105"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <HiKey className="text-yellow-500" />
          <span>
            {apiKey || import.meta.env.VITE_GEMINI_API_KEY
              ? "Gemini AI Ready"
              : "Set API Key"}
          </span>
        </button>
      </div>

      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center pt-8 pb-6 px-6 relative z-10"
      >
        <div className="inline-block bg-white/60 backdrop-blur-md px-5 py-1.5 rounded-full border-2 border-white mb-4 shadow-sm">
          <span className="text-kidPink font-black text-sm uppercase tracking-wider flex items-center gap-1.5 justify-center">
            <FaMagic /> AI Story Creator Wizard
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-[#5253A3] uppercase tracking-tight drop-shadow-sm">
          Craft Your Adventure ✨
        </h1>
        <p className="text-[#5253A3]/85 text-base md:text-xl font-bold max-w-2xl mx-auto mt-2">
          Turn your imagination into a fully illustrated, printable children's
          storybook in 3 simple steps!
        </p>
      </motion.div>

      {/* 3-Step Wizard Progress Bar */}
      <div className="max-w-2xl mx-auto px-6 mb-10 relative z-10">
        <div className="flex items-center justify-between relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-white/70 -translate-y-1/2 rounded-full -z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-kidPink to-[#5253A3] -translate-y-1/2 rounded-full transition-all duration-500 -z-0"
            style={{
              width: activeStep === 1 ? "15%" : activeStep === 2 ? "55%" : "100%",
            }}
          ></div>

          {/* Step 1 Pill */}
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm shadow-md border-2 border-white transition-all z-10 ${
              activeStep === 1
                ? "bg-[#5253A3] text-white scale-105 ring-4 ring-[#5253A3]/20"
                : "bg-white text-[#5253A3] hover:bg-gray-50"
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-xs">
              1
            </span>
            <span>The Hero 🧙‍♂️</span>
          </button>

          {/* Step 2 Pill */}
          <button
            type="button"
            onClick={() => {
              if (validateStep1()) setActiveStep(2);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm shadow-md border-2 border-white transition-all z-10 ${
              activeStep === 2
                ? "bg-[#5253A3] text-white scale-105 ring-4 ring-[#5253A3]/20"
                : "bg-white text-[#5253A3] hover:bg-gray-50"
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-xs">
              2
            </span>
            <span>Story Style 📖</span>
          </button>

          {/* Step 3 Pill */}
          <button
            type="button"
            onClick={() => {
              if (validateStep1()) setActiveStep(3);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm shadow-md border-2 border-white transition-all z-10 ${
              activeStep === 3
                ? "bg-[#5253A3] text-white scale-105 ring-4 ring-[#5253A3]/20"
                : "bg-white text-[#5253A3] hover:bg-gray-50"
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-xs">
              3
            </span>
            <span>Magic Vibes 🎨</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
          {/* Left Column: Active Step Controls */}
          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              {/* STEP 1: The Hero & Prompt */}
              {activeStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white/60 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border-4 border-white shadow-2xl flex flex-col gap-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#5253A3]/15 pb-6">
                    <div>
                      <h2 className="text-3xl font-black text-[#5253A3]">
                        Step 1: Meet the Star ⭐
                      </h2>
                      <p className="text-gray-600 font-bold text-sm mt-1">
                        Tell us who is starring in this tale and what adventure unfolds.
                      </p>
                    </div>

                    {/* Surprise Me Magic Dice */}
                    <button
                      type="button"
                      onClick={handleSurpriseMe}
                      className="px-5 py-2.5 bg-gradient-to-r from-kidPink to-rose-400 hover:from-pink-400 hover:to-rose-500 text-white rounded-full font-black text-sm shadow-lg flex items-center gap-2 hover:scale-105 transition-all self-start sm:self-auto"
                    >
                      <FaDice className="text-lg animate-spin" style={{ animationDuration: "10s" }} />
                      <span>Surprise Me! 🎲</span>
                    </button>
                  </div>

                  {/* Child's Name Input */}
                  <div>
                    <label className="block text-xl font-black text-[#5253A3] mb-2">
                      Child's Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="E.g., Benny, Emma, Leo..."
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full bg-white p-4 rounded-3xl outline-none text-lg shadow-md border-4 border-transparent focus:border-kidPink transition font-bold text-[#5253A3]"
                    />
                  </div>

                  {/* Subject Textarea with Voice Dictation */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xl font-black text-[#5253A3]">
                        Subject / Story Idea <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleVoiceInput}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm border-2 transition ${
                          isListening
                            ? "bg-red-500 text-white border-white animate-pulse"
                            : "bg-white text-kidPink border-kidPink hover:bg-pink-50"
                        }`}
                        title="Speak your story idea"
                      >
                        <HiMicrophone className="text-base" />
                        <span>{isListening ? "Listening..." : "Speak Idea 🎤"}</span>
                      </button>
                    </div>
                    <textarea
                      placeholder="E.g., A clumsy baby dragon who sneezes popcorn instead of fire at the kingdom fair..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white h-36 rounded-3xl outline-none p-5 text-lg shadow-md border-4 border-transparent focus:border-kidBlue transition resize-none font-bold text-[#5253A3]"
                      required
                    />

                    {/* Quick Inspiration Chips */}
                    <div className="mt-3">
                      <span className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-2">
                        Quick Inspiration Ideas:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {quickInspirations.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              playPop();
                              setSubject(item.text);
                            }}
                            className="bg-white/80 hover:bg-white text-[#5253A3] text-xs font-black px-3 py-1.5 rounded-full border border-white shadow-sm hover:scale-105 transition"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hero Designer Mini Bento */}
                  <div className="bg-white/50 p-6 rounded-3xl border-2 border-white shadow-inner">
                    <h3 className="text-xl font-black text-[#5253A3] mb-4 flex items-center gap-2">
                      <span>Customize Hero Traits 🧙‍♂️</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black text-[#5253A3] uppercase tracking-wider mb-1 block">
                          Hero Type
                        </label>
                        <select
                          value={heroTraits.type}
                          onChange={(e) =>
                            setHeroTraits({ ...heroTraits, type: e.target.value })
                          }
                          className="w-full p-3.5 rounded-2xl bg-white outline-none font-bold text-[#5253A3] shadow-sm border-2 border-transparent focus:border-kidPink"
                        >
                          <option value="human">🧒 Human Boy/Girl</option>
                          <option value="animal">🦊 Cute Animal</option>
                          <option value="fantasy">🦄 Magical Creature</option>
                          <option value="robot">🤖 Friendly Robot</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-black text-[#5253A3] uppercase tracking-wider mb-1 block">
                          Personality
                        </label>
                        <select
                          value={heroTraits.personality}
                          onChange={(e) =>
                            setHeroTraits({
                              ...heroTraits,
                              personality: e.target.value,
                            })
                          }
                          className="w-full p-3.5 rounded-2xl bg-white outline-none font-bold text-[#5253A3] shadow-sm border-2 border-transparent focus:border-kidPink"
                        >
                          <option value="brave">Brave 🦁</option>
                          <option value="funny">Funny 😂</option>
                          <option value="curious">Curious 🔍</option>
                          <option value="kind">Kind 💖</option>
                          <option value="magical">Magical ✨</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-black text-[#5253A3] uppercase tracking-wider mb-1 block">
                          Appearance
                        </label>
                        <input
                          type="text"
                          placeholder="E.g., Golden hair and bright green eyes"
                          value={heroTraits.appearance}
                          onChange={(e) =>
                            setHeroTraits({
                              ...heroTraits,
                              appearance: e.target.value,
                            })
                          }
                          className="w-full p-3.5 rounded-2xl bg-white outline-none font-bold text-[#5253A3] shadow-sm border-2 border-transparent focus:border-kidPink text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-black text-[#5253A3] uppercase tracking-wider mb-1 block">
                          Favorite Outfit
                        </label>
                        <input
                          type="text"
                          placeholder="E.g., A red cape and starry boots"
                          value={heroTraits.outfit}
                          onChange={(e) =>
                            setHeroTraits({ ...heroTraits, outfit: e.target.value })
                          }
                          className="w-full p-3.5 rounded-2xl bg-white outline-none font-bold text-[#5253A3] shadow-sm border-2 border-transparent focus:border-kidPink text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Story Style & Audience */}
              {activeStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white/60 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border-4 border-white shadow-2xl flex flex-col gap-8"
                >
                  <div className="border-b border-[#5253A3]/15 pb-6">
                    <h2 className="text-3xl font-black text-[#5253A3]">
                      Step 2: Story Style & Audience 📖
                    </h2>
                    <p className="text-gray-600 font-bold text-sm mt-1">
                      Choose the book format, reading age, and story language.
                    </p>
                  </div>

                  {/* Language Selection */}
                  <div>
                    <label className="block text-xl font-black text-[#5253A3] mb-2">
                      Story Language 🌍
                    </label>
                    <select
                      value={language}
                      onChange={(e) => {
                        playPop();
                        setLanguage(e.target.value);
                      }}
                      className="bg-white w-full sm:max-w-md rounded-3xl outline-none p-4 text-lg shadow-md border-4 border-transparent focus:border-kidBlue transition font-bold text-[#5253A3]"
                    >
                      <option value="English">English 🇬🇧</option>
                      <option value="Spanish">Spanish 🇪🇸</option>
                      <option value="French">French 🇫🇷</option>
                      <option value="Hindi">Hindi 🇮🇳</option>
                      <option value="German">German 🇩🇪</option>
                      <option value="Japanese">Japanese 🇯🇵</option>
                    </select>
                  </div>

                  {/* Story Type Cards */}
                  <div>
                    <label className="block text-xl font-black text-[#5253A3] mb-4">
                      Book Format 📚
                    </label>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-6">
                      {storyTypes.map((type) => (
                        <SelectableCardWithSkeleton
                          key={type.value}
                          label={type.label}
                          imageUrl={type.imageUrl}
                          isSelected={storyType === type.value}
                          onClick={() => {
                            playPop();
                            setStoryType(type.value);
                          }}
                          size="large"
                          ringColor="ring-kidPink"
                          placeholderIcon={type.icon}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Age Group Cards */}
                  <div>
                    <label className="block text-xl font-black text-[#5253A3] mb-4">
                      Target Age Group 🧸
                    </label>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-5">
                      {ageGroups.map((group) => (
                        <SelectableCardWithSkeleton
                          key={group.value}
                          label={group.label}
                          imageUrl={group.imageUrl}
                          isSelected={ageGroup === group.value}
                          onClick={() => {
                            playPop();
                            setAgeGroup(group.value);
                          }}
                          size="standard"
                          ringColor="ring-kidYellow"
                          placeholderIcon={group.icon}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Magic Vibes & Mood */}
              {activeStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white/60 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border-4 border-white shadow-2xl flex flex-col gap-8"
                >
                  <div className="border-b border-[#5253A3]/15 pb-6">
                    <h2 className="text-3xl font-black text-[#5253A3]">
                      Step 3: Magic Vibes & Mood 🎨
                    </h2>
                    <p className="text-gray-600 font-bold text-sm mt-1">
                      Set the emotional tone, theme, and reading length for your adventure.
                    </p>
                  </div>

                  {/* Story Tone */}
                  <div>
                    <label className="block text-xl font-black text-[#5253A3] mb-4">
                      Story Tone 🎭
                    </label>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                      {storyTones.map((tone) => (
                        <SelectableCardWithSkeleton
                          key={tone.value}
                          label={tone.label}
                          imageUrl={tone.imageUrl}
                          isSelected={storyTone === tone.value}
                          onClick={() => {
                            playPop();
                            setStoryTone(tone.value);
                          }}
                          size="standard"
                          ringColor="ring-kidBlue"
                          placeholderIcon={tone.icon}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Story Theme */}
                  <div>
                    <label className="block text-xl font-black text-[#5253A3] mb-4">
                      Core Theme 🌟
                    </label>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                      {storyThemes.map((theme) => (
                        <SelectableCardWithSkeleton
                          key={theme.value}
                          label={theme.label}
                          imageUrl={theme.imageUrl}
                          isSelected={storyTheme === theme.value}
                          onClick={() => {
                            playPop();
                            setStoryTheme(theme.value);
                          }}
                          size="standard"
                          ringColor="ring-kidGreen"
                          placeholderIcon={theme.icon}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Story Length */}
                  <div>
                    <label className="block text-xl font-black text-[#5253A3] mb-4">
                      Story Length ⏳
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {storyLengths.map((len) => (
                        <motion.div
                          key={len.value}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            playPop();
                            setStoryLength(len.value);
                          }}
                          className={`cursor-pointer p-5 rounded-3xl shadow-md border-4 transition-all flex flex-col items-center justify-center text-center ${
                            storyLength === len.value
                              ? "bg-white border-kidPink ring-4 ring-kidPink/30"
                              : "bg-white/70 border-white text-gray-600 hover:bg-white"
                          }`}
                        >
                          <span className="text-3xl mb-2">{len.emoji}</span>
                          <span className="font-black text-[#5253A3] text-sm">
                            {len.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stepper Navigation Actions */}
            <div className="flex items-center justify-between mt-8">
              {activeStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 bg-white text-[#5253A3] rounded-full font-black text-base shadow-md border-2 border-white hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <HiArrowLeft />
                  <span>Back</span>
                </button>
              ) : (
                <div></div>
              )}

              {activeStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-8 py-4 bg-[#5253A3] text-white rounded-full font-black text-lg shadow-xl border-4 border-white hover:bg-[#43448f] transition flex items-center gap-2 hover:scale-105"
                >
                  <span>Continue</span>
                  <HiArrowRight />
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-10 py-5 bg-gradient-to-r from-kidYellow via-amber-300 to-yellow-400 text-[#5253A3] text-2xl font-black rounded-full shadow-2xl border-4 border-white flex items-center gap-3"
                >
                  <span>Generate Story</span>
                  <span className="text-sm bg-white/60 px-3 py-1 rounded-full text-kidPink font-black flex items-center gap-1">
                    -1 <HiSparkles />
                  </span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Live Book Preview Widget */}
          <div className="w-full lg:w-1/3 flex flex-col items-center sticky top-8">
            <LiveBookPreview
              childName={childName}
              subject={subject}
              heroTraits={heroTraits}
              storyType={storyType}
              ageGroup={ageGroup}
              storyTone={storyTone}
              storyTheme={storyTheme}
              storyLength={storyLength}
              language={language}
            />

            {/* Helper Hint */}
            <div className="mt-6 bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white text-center text-xs font-bold text-[#5253A3] max-w-[280px]">
              💡 Your book cover updates live as you tweak your character and themes!
            </div>
          </div>
        </div>
      </form>

      {/* Sleek Floating API Key Modal */}
      {showApiModal && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border-4 border-white relative text-center"
          >
            <button
              onClick={() => setShowApiModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
            >
              <HiX size={20} />
            </button>
            <span className="text-4xl mb-2 inline-block">🔑</span>
            <h3 className="text-2xl font-black text-[#5253A3] mb-2">
              Gemini AI API Key
            </h3>
            <p className="text-xs text-gray-600 font-bold mb-4">
              Enter your Google AI Studio key below. It is stored securely in your browser's local storage.
            </p>
            <input
              type="password"
              placeholder="Paste your API Key here"
              value={apiKey}
              onChange={handleApiKeyChange}
              className="w-full bg-gray-50 p-4 rounded-2xl outline-none border-2 border-gray-200 focus:border-kidPink text-center font-bold text-[#5253A3] mb-4 text-sm"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowApiModal(false)}
                className="flex-1 py-3 bg-[#5253A3] text-white rounded-full font-black text-sm hover:bg-[#43448f] transition shadow-md"
              >
                Save & Close
              </button>
            </div>
            <p className="text-[11px] text-gray-400 font-bold mt-4">
              Need a key? Get one free at{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="underline text-kidPink"
              >
                Google AI Studio
              </a>
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StoryGenerator;