import React, { useState, useRef, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaVolumeUp,
  FaStop,
  FaFilePdf,
  FaSearch,
  FaShareAlt,
  FaPlay,
  FaPause,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaMagic,
  FaHeadphones,
  FaPalette,
  FaStar,
  FaTheaterMasks,
  FaGlobe,
  FaBrain,
  FaSmile,
  FaCompass,
  FaMoon,
  FaGraduationCap,
} from "react-icons/fa";
import {
  HiSparkles,
  HiBookOpen,
  HiX,
  HiOutlineBookOpen,
} from "react-icons/hi";
import html2pdf from "html2pdf.js";
import confetti from "canvas-confetti";
import useSound from "use-sound";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { demoStories } from "../data/demoStories";
import ImageWithSkeleton from "./common/ImageWithSkeleton";
import defaultCoverFallback from "../assets/story.webp";

// Helper function to split text into pages
function paginateText(text, wordLimit = 25) {
  if (!text) return [];
  const words = text.split(" ");
  let pages = [];
  let pageText = [];

  words.forEach((word) => {
    pageText.push(word);
    if (pageText.length >= wordLimit && word.includes(".")) {
      pages.push(pageText.join(" "));
      pageText = [];
    }
  });

  if (pageText.length > 0) {
    pages.push(pageText.join(" "));
  }

  return pages;
}

// Component to stagger image loading with animated skeleton shimmer
function StaggeredImage({
  src,
  alt,
  index,
  className,
  fallbackSrc = defaultCoverFallback,
}) {
  const [loadSrc, setLoadSrc] = useState(src || fallbackSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const validSrc = src || fallbackSrc;
    setLoadSrc(validSrc);
    setIsLoaded(false);
    setError(false);

    if (index === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setLoadSrc(validSrc);
    }, Math.min(index * 350, 1200));

    return () => clearTimeout(timer);
  }, [src, fallbackSrc, index]);

  return (
    <div
      className={
        className +
        " relative bg-white/60 flex items-center justify-center overflow-hidden transition-all duration-700 group"
      }
    >
      {!error && (!loadSrc || !isLoaded) && (
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 animate-shimmer flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center opacity-70 animate-pulse">
            <HiSparkles className="text-3xl text-kidPink mb-1" />
            <span className="text-xs font-bold text-[#5253A3] italic">
              Sketching magic...
            </span>
          </div>
        </div>
      )}

      {error ? (
        <div className="flex flex-col items-center justify-center text-[#5253A3] p-4 text-center z-10 bg-indigo-50/80 w-full h-full">
          <HiBookOpen className="text-4xl text-[#5253A3] mb-2" />
          <p className="text-xs font-black uppercase text-[#5253A3] tracking-wider">
            {alt || "Magical Illustration"}
          </p>
        </div>
      ) : loadSrc ? (
        <div className="relative w-full h-full">
          <img
            src={loadSrc}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-700 ${
              isLoaded ? "opacity-100 grayscale group-hover:grayscale-0" : "opacity-0"
            }`}
            onLoad={(e) => {
              setIsLoaded(true);
              e.target.classList.remove("grayscale");
              e.target.style.filter = "none";
            }}
            onError={() => {
              if (loadSrc !== fallbackSrc && fallbackSrc) {
                setLoadSrc(fallbackSrc);
              } else {
                setError(true);
                setIsLoaded(true);
              }
            }}
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-25 pointer-events-none"></div>
        </div>
      ) : null}
    </div>
  );
}

// Full-Screen Immersive Reader Modal
function FlipbookReaderModal({
  story,
  onClose,
  onDownloadPDF,
  onDownloadColoringBook,
  onShare,
  onPlayAudiobook,
  unlockAchievement,
}) {
  const bookRef = useRef(null);
  const [isBilingual, setIsBilingual] = useState(false);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [quizAnswered, setQuizAnswered] = useState(null);

  const [playPageTurn] = useSound(
    "https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3",
    { volume: 0.3 }
  );
  const [playPop] = useSound(
    "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
    { volume: 0.5 }
  );

  const pages = paginateText(story.text, 25);
  const totalBookPages = pages.length + 2; // Cover + story pages + Back cover

  const handleFlip = (e) => {
    playPageTurn();
    setCurrentPageNum(e.data + 1);
    if (e.data >= totalBookPages - 1) {
      confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#FF9EBB", "#FFF6A3", "#83E4F6", "#98FB98"],
      });
      playPop();
      if (unlockAchievement) {
        unlockAchievement("bookworm", "Bookworm", "📖");
      }
    }
  };

  const turnNext = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const turnPrev = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const handleQuizChoice = (option, answer) => {
    if (option === answer) {
      setQuizAnswered(option);
      playPop();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      toast.success("Brilliant! 🎉 You got it right!", { icon: "🌟" });
      if (unlockAchievement) {
        unlockAchievement("quiz_whiz", "Quiz Whiz", "🧠");
      }
    } else {
      toast.error("Almost! Try another choice 🤔");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-between p-4 md:p-6 overflow-hidden">
      {/* Top Reader Navbar */}
      <div className="w-full max-w-5xl flex items-center justify-between bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white z-20">
        <div className="flex items-center gap-3">
          <HiBookOpen className="text-2xl text-yellow-300" />
          <h2 className="text-lg md:text-xl font-black line-clamp-1">
            {story.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setIsBilingual(!isBilingual)}
            className={`px-3 md:px-4 py-1.5 rounded-full font-black text-xs md:text-sm border transition shadow-sm flex items-center gap-1.5 ${
              isBilingual
                ? "bg-kidBlue text-[#5253A3] border-white"
                : "bg-white/20 text-white border-white/40 hover:bg-white/30"
            }`}
          >
            <FaGlobe className="text-xs" />
            <span>Bilingual: {isBilingual ? "ON" : "OFF"}</span>
          </button>

          <button
            onClick={() => onPlayAudiobook(story, isBilingual)}
            className="px-3 md:px-4 py-1.5 rounded-full bg-kidYellow text-[#5253A3] font-black text-xs md:text-sm shadow-md hover:scale-105 transition flex items-center gap-1.5"
          >
            <FaHeadphones size={13} />
            <span className="hidden sm:inline">Audiobook</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition ml-2"
            title="Close Reader"
          >
            <HiX size={20} />
          </button>
        </div>
      </div>

      {/* Centered Flipbook Viewport */}
      <div className="flex-1 w-full flex items-center justify-center my-4 overflow-hidden relative">
        <HTMLFlipBook
          ref={bookRef}
          width={400}
          height={530}
          showCover={true}
          onFlip={handleFlip}
          className="shadow-[0_25px_60px_rgba(0,0,0,0.6)] rounded-r-2xl overflow-hidden cursor-pointer"
        >
          {/* Cover Page */}
          <div className="relative h-full overflow-hidden flex flex-col rounded-r-2xl border-l-[16px] border-[#a04865] bg-gradient-to-br from-pink-200 via-indigo-100 to-amber-100 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
            <div className="absolute inset-0 z-0">
              <StaggeredImage
                src={story.imageUrl || story.coverImage || defaultCoverFallback}
                fallbackSrc={defaultCoverFallback}
                alt={story.title}
                index={0}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/15"></div>
            </div>

            <div className="relative z-10 w-full h-full flex flex-col justify-between items-center p-8 text-center">
              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-xl w-full">
                <h1 className="text-3xl font-black text-[#5253A3] leading-tight">
                  {story.title}
                </h1>
                {story.childName && (
                  <p className="text-sm font-bold text-kidPink uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                    <FaStar className="text-amber-400 text-xs inline" />
                    <span>Starring: {story.childName}</span>
                  </p>
                )}
              </div>

              <div className="bg-white/70 backdrop-blur-md p-4 rounded-3xl border border-white/60 w-full shadow-lg flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-700 capitalize flex items-center justify-center gap-1.5">
                  <HiBookOpen className="text-indigo-600 text-sm" />
                  <span>{story.storyType} • {story.language || "English"}</span>
                </span>
                <div className="px-4 py-2 bg-[#a04865] text-white rounded-full font-black text-sm shadow animate-pulse flex items-center justify-center gap-2">
                  <span>Click Edge to Turn Page</span>
                  <FaArrowRight className="text-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Story Pages */}
          {pages.map((pageContent, pageIndex) => {
            const geminiPrompt =
              story.pageImagePrompts && story.pageImagePrompts[pageIndex];
            const pageImagePrompt =
              geminiPrompt ||
              `Children's book illustration: ${story.subject}, ${pageContent.substring(0, 45)}. Colorful Disney Pixar style`;
            const pageImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
              pageImagePrompt
            )}?width=800&height=800&nologo=true&seed=${pageIndex + 120}&model=flux`;

            return (
              <div
                key={pageIndex}
                className="relative h-full overflow-hidden flex flex-col shadow-[inset_0_0_10px_rgba(0,0,0,0.1)] border-l border-gray-300 bg-white"
              >
                <div className="absolute inset-0 z-0">
                  <StaggeredImage
                    src={pageImageUrl}
                    alt={story.subject}
                    index={pageIndex + 1}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="relative z-10 flex flex-col h-full p-6 md:p-8">
                  <h3 className="text-xl font-black capitalize text-[#5253A3] mb-3 drop-shadow-sm">
                    {story.title}
                  </h3>

                  <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-lg">
                    <p className="text-base md:text-lg leading-relaxed text-gray-900 font-bold">
                      {pageContent}
                    </p>
                    {isBilingual && story.englishText && (
                      <p className="text-sm leading-relaxed text-gray-600 italic font-bold mt-3 pt-3 border-t border-gray-300">
                        {paginateText(story.englishText)[pageIndex] ||
                          "Translating..."}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200/60 flex justify-between items-center text-[#5253A3] font-black text-xs uppercase tracking-wider">
                    <span className="bg-white/80 px-3 py-1 rounded-full shadow-sm">
                      Page {pageIndex + 1} of {pages.length}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Back Cover / Quiz Page */}
          <div className="flex flex-col justify-between items-center bg-[#5253A3] text-white h-full p-6 md:p-8 text-center rounded-l-2xl border-r-[16px] border-[#3f4082] shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] overflow-y-auto">
            <div>
              <h2 className="text-4xl font-extrabold mb-1 drop-shadow-md flex items-center justify-center gap-2">
                <span>The End</span>
                <HiSparkles className="text-yellow-300 text-3xl" />
              </h2>
              <p className="text-xs text-kidYellow font-bold uppercase tracking-wider">
                Thanks for reading!
              </p>
            </div>

            {/* Quiz Card */}
            {story.quiz && story.quiz.length > 0 && (
              <div className="bg-white/15 p-5 rounded-3xl w-full text-left border border-white/20 shadow-inner my-3">
                <div className="flex items-center gap-2 text-kidYellow font-black text-base mb-2">
                  <FaBrain className="text-kidYellow text-lg" />
                  <span>Reading Quiz Time!</span>
                </div>
                <p className="font-bold text-xs md:text-sm mb-3 text-white">
                  {story.quiz[0]?.question}
                </p>
                <div className="flex flex-col gap-2">
                  {story.quiz[0]?.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuizChoice(opt, story.quiz[0].answer)}
                      className={`px-3 py-2 rounded-xl text-xs font-black text-left transition shadow-sm border ${
                        quizAnswered === opt
                          ? "bg-kidYellow text-[#5253A3] border-white scale-102"
                          : "bg-white text-[#5253A3] border-transparent hover:bg-yellow-100"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={(e) => onDownloadPDF(e, story)}
                className="w-full py-2.5 rounded-full bg-kidYellow text-[#5253A3] font-black text-xs shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <FaFilePdf size={13} />
                <span>Save as PDF</span>
              </button>
              <button
                onClick={(e) => onDownloadColoringBook(e, story)}
                className="w-full py-2.5 rounded-full bg-white text-kidPink font-black text-xs shadow-md hover:scale-105 transition border-2 border-kidPink flex items-center justify-center gap-2"
              >
                <FaPalette size={13} />
                <span>Print Coloring Book</span>
              </button>
              <button
                onClick={(e) => onShare(e, story)}
                className="w-full py-2 rounded-full bg-white/20 text-white font-bold text-xs hover:bg-white/30 transition border border-white/30 flex items-center justify-center gap-2"
              >
                <FaShareAlt size={12} />
                <span>Share Magic Link</span>
              </button>
            </div>
          </div>
        </HTMLFlipBook>
      </div>

      {/* Bottom Page Navigation Controls */}
      <div className="flex items-center gap-4 z-20">
        <button
          onClick={turnPrev}
          className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-black text-sm backdrop-blur-md border border-white/30 shadow transition flex items-center gap-2"
        >
          <FaArrowLeft />
          <span>Previous</span>
        </button>

        <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
          Page {currentPageNum} of {totalBookPages}
        </span>

        <button
          onClick={turnNext}
          className="px-5 py-2.5 rounded-full bg-white text-[#5253A3] hover:bg-yellow-200 font-black text-sm shadow-lg transition flex items-center gap-2"
        >
          <span>Next</span>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

// Main Library Component
function GeneratedBooks({
  generatedStories = [],
  updateGeneratedStories,
  unlockAchievement,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [activeReadingStory, setActiveReadingStory] = useState(null);

  // Floating Audiobook Player State
  const [audioState, setAudioState] = useState({
    isPlaying: false,
    isPaused: false,
    storyTitle: "",
    currentPage: 0,
    totalPages: 0,
    rate: 0.9,
  });

  const categories = [
    { label: "All Stories", value: "All", icon: HiSparkles },
    { label: "Funny", value: "funny", icon: FaSmile },
    { label: "Adventure", value: "adventurous", icon: FaCompass },
    { label: "Bedtime", value: "bedtime", icon: FaMoon },
    { label: "Educational", value: "educational", icon: FaGraduationCap },
    { label: "Bilingual", value: "bilingual", icon: FaGlobe },
  ];

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Normalize legacy stories from localStorage where only coverImage was stored
  useEffect(() => {
    if (generatedStories && generatedStories.length > 0) {
      let changed = false;
      const normalized = generatedStories.map((story) => {
        if (!story.imageUrl && story.coverImage) {
          changed = true;
          return { ...story, imageUrl: story.coverImage };
        }
        return story;
      });
      if (changed) {
        updateGeneratedStories(normalized);
      }
    }
  }, [generatedStories]);

  // Filter & Sort Stories
  const filteredStories = generatedStories.filter((s) => {
    const matchSearch =
      !searchQuery ||
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.childName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subject?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategory === "All" ||
      (selectedCategory === "bilingual" &&
        s.language &&
        s.language !== "English") ||
      (selectedCategory === "educational" &&
        (s.storyType === "educational" || s.storyTheme === "discovery")) ||
      (selectedCategory === "bedtime" &&
        (s.storyType === "bed story" || s.storyTone === "calm")) ||
      (selectedCategory === "adventurous" &&
        (s.storyTone === "adventurous" || s.storyTone === "exciting")) ||
      (selectedCategory === "funny" && s.storyTone === "funny");

    return matchSearch && matchCategory;
  });

  const sortedStories = [...filteredStories].sort((a, b) => {
    if (sortBy === "az") {
      return (a.title || "").localeCompare(b.title || "");
    }
    return 0; // default newest
  });

  const handleDeleteStory = (storyToDelete) => {
    if (window.confirm(`Are you sure you want to delete "${storyToDelete.title}"?`)) {
      const updated = generatedStories.filter((s) => s !== storyToDelete);
      updateGeneratedStories(updated);
      toast.success("Book removed from library");
      if (activeReadingStory === storyToDelete) {
        setActiveReadingStory(null);
      }
    }
  };

  const handleLoadDemoStories = () => {
    updateGeneratedStories(demoStories);
    toast.success("🪄 Sample magical stories loaded!", { icon: "📚" });
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Audiobook Player Logic
  const handlePlayAudiobook = (story, isBilingual = false) => {
    window.speechSynthesis.cancel();
    const textToRead = isBilingual ? story.englishText || story.text : story.text;
    const pages = paginateText(textToRead, 25);
    let currentPage = 0;

    setAudioState({
      isPlaying: true,
      isPaused: false,
      storyTitle: story.title || "Kiddo Tale",
      currentPage: 1,
      totalPages: pages.length,
      rate: 0.9,
    });

    toast("🎧 Playing audiobook...", { icon: "🎶" });

    const readNextPage = () => {
      if (currentPage >= pages.length) {
        setAudioState((prev) => ({ ...prev, isPlaying: false }));
        return;
      }

      setAudioState((prev) => ({ ...prev, currentPage: currentPage + 1 }));

      const utterance = new SpeechSynthesisUtterance(pages[currentPage]);
      utterance.rate = 0.9;

      utterance.onend = () => {
        currentPage++;
        setTimeout(readNextPage, 900);
      };

      window.speechSynthesis.speak(utterance);
    };

    readNextPage();
  };

  const pauseAudiobook = () => {
    window.speechSynthesis.pause();
    setAudioState((prev) => ({ ...prev, isPaused: true }));
  };

  const resumeAudiobook = () => {
    window.speechSynthesis.resume();
    setAudioState((prev) => ({ ...prev, isPaused: false }));
  };

  const stopAudiobook = () => {
    window.speechSynthesis.cancel();
    setAudioState({
      isPlaying: false,
      isPaused: false,
      storyTitle: "",
      currentPage: 0,
      totalPages: 0,
      rate: 0.9,
    });
  };

  // Share Magic Link
  const handleShareMagicLink = (e, story) => {
    if (e) e.stopPropagation();
    const shareData = {
      t: story.title,
      s: story.subject,
      tx: story.text,
      et: story.englishText,
      i: story.imageUrl || story.coverImage,
      l: story.language,
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const url = `${window.location.origin}/?magic=${encoded}`;

    navigator.clipboard.writeText(url).then(() => {
      toast.success("✨ Magic Link copied to clipboard! Share with friends.", {
        icon: "🔗",
        style: { borderRadius: "20px", background: "#5253A3", color: "#fff" },
      });
      if (unlockAchievement) {
        unlockAchievement("sharer", "Social Star", "🌟");
      }
    });
  };

  // Download Coloring Book PDF
  const handleDownloadColoringBook = async (e, story) => {
    if (e) e.stopPropagation();
    const loadingToast = toast.loading("🎨 Preparing your coloring pages...", {
      style: { borderRadius: "20px", background: "#5253A3", color: "#fff" },
    });

    const pages = paginateText(story.text, 25);

    const getBase64Image = async (url) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        return url;
      }
    };

    let printHtml = `
      <html>
        <head>
          <title>${story.title || "Coloring Book"}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;700&display=swap');
            @media print {
              .page-break { page-break-after: always; }
              body { font-family: 'Fredoka', sans-serif; text-align: center; margin: 0; padding: 0; }
              .coloring-card { width: 100%; height: 95vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box; }
              img { width: 90%; max-height: 70vh; object-fit: contain; border: 3px solid black; border-radius: 20px; }
              h1 { font-size: 48px; margin-bottom: 20px; color: black; }
              p { font-size: 24px; font-weight: bold; margin-top: 20px; color: black; max-width: 80%; }
              .footer { position: fixed; bottom: 20px; width: 100%; font-size: 14px; color: #666; }
            }
            body { font-family: 'Fredoka', sans-serif; text-align: center; background: #f0f0f0; padding: 20px; }
            .page-break { margin-bottom: 50px; background: white; padding: 40px; border-radius: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); max-width: 900px; margin-left: auto; margin-right: auto; min-height: 90vh; display: flex; flex-direction: column; justify-content: center; align-items: center; }
            img { max-width: 100%; max-height: 600px; border: 3px solid black; border-radius: 20px; }
            h1 { font-size: 48px; margin-bottom: 20px; color: #5253A3; }
            p { font-size: 24px; font-weight: bold; margin-top: 20px; }
            .cover { background: #FF9EBB !important; color: white !important; }
            .cover h1 { color: white !important; font-size: 64px; }
          </style>
        </head>
        <body>
          <div class="page-break cover">
            <h1>🎨 My Magical Coloring Book</h1>
            <h2 style="font-size: 40px;">${story.title}</h2>
            ${story.childName ? `<p style="font-size: 32px;">Starring: ${story.childName}</p>` : ""}
            <p style="margin-top: 50px;">Time to color your own adventure! ✨</p>
          </div>
    `;

    for (let i = 0; i < pages.length; i++) {
      const pageImagePrompt = `highly detailed coloring page for kids, thick black outlines, simple white background, no grey, no shading, clean line art. Scene: ${story.subject}, ${pages[i].substring(0, 50)}.`;
      const pageImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        pageImagePrompt
      )}?width=800&height=1000&nologo=true&seed=${i + 42}`;

      const base64Url = await getBase64Image(pageImageUrl);
      printHtml += `
        <div class="page-break">
          <img src="${base64Url}" onload="window.imageLoaded()" onerror="window.imageLoaded()" />
          <p>${pages[i]}</p>
          <div class="footer">Kiddos Tales - Create Your Own Magic</div>
        </div>
      `;
    }

    printHtml += `
          <script>
            let loadedCount = 0;
            const totalImages = ${pages.length};
            function imageLoaded() {
              loadedCount++;
              if (loadedCount >= totalImages) {
                setTimeout(() => { window.print(); }, 800);
              }
            }
            setTimeout(() => { if(loadedCount < totalImages) window.print(); }, 5000);
          </script>
        </body>
      </html>
    `;

    toast.dismiss(loadingToast);
    toast.success("🖍️ Opening Print Preview! Select 'Save as PDF' to save.", {
      duration: 5000,
      style: { borderRadius: "20px", background: "#FF9EBB", color: "#fff" },
    });

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printHtml);
      printWindow.document.close();
    } else {
      toast.error("Please allow popups to print your coloring book!");
    }
  };

  // Download PDF
  const handleDownloadPDF = async (e, story) => {
    if (e) e.stopPropagation();
    const loadingToast = toast.loading("🪄 Formatting your magical PDF...", {
      style: { borderRadius: "20px", background: "#5253A3", color: "#fff" },
    });

    const pages = paginateText(story.text, 25);
    const element = document.createElement("div");
    element.style.width = "800px";

    let htmlContent = `
      <div style="font-family: 'Fredoka', sans-serif; color: #333; background: #fff;">
        <div style="padding: 60px; text-align: center; background: #CAD3FF; color: #5253A3; border-bottom: 10px solid #fff;">
          <h1 style="font-size: 48px; margin-bottom: 10px;">${story.title}</h1>
          ${story.childName ? `<h2 style="font-size: 24px; color: #FF4E98;">Starring: ${story.childName}</h2>` : ""}
          <img src="${story.imageUrl || story.coverImage || defaultCoverFallback}" style="width: 300px; height: 300px; object-fit: cover; border-radius: 30px; border: 8px solid white; margin-top: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
        </div>
    `;

    for (let i = 0; i < pages.length; i++) {
      const pageImagePrompt = `Children's book illustration for: ${story.subject}, ${pages[i].substring(0, 50)}. ${story.storyTheme} theme, colorful, professional illustration`;
      const pageImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        pageImagePrompt
      )}?width=800&height=500&nologo=true&seed=${i + 50}`;

      htmlContent += `
        <div style="padding: 40px; page-break-after: always; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 800px;">
          <img src="${pageImageUrl}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 20px; border: 4px solid #CAD3FF; margin-bottom: 30px;" />
          <p style="font-size: 22px; line-height: 1.8; text-align: center; font-weight: 500; max-width: 90%;">${pages[i]}</p>
          <div style="margin-top: 50px; color: #CAD3FF; font-weight: bold; font-size: 14px;">Page ${i + 1}</div>
        </div>
      `;
    }

    htmlContent += `</div>`;
    element.innerHTML = htmlContent;

    const opt = {
      margin: 0,
      filename: `${story.title || "story"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      await html2pdf().from(element).set(opt).save();
      toast.dismiss(loadingToast);
      toast.success("✨ Your book PDF is downloaded!", {
        style: { borderRadius: "20px", background: "#FF9EBB", color: "#fff" },
      });
    } catch (err) {
      console.error(err);
      toast.dismiss(loadingToast);
      toast.error("Failed to generate PDF. Try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#CAD3FF] via-[#dfe5ff] to-[#CAD3FF] p-6 md:p-12 pb-28 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-kidPink rounded-full mix-blend-soft-light filter blur-3xl opacity-25 animate-blob"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-kidYellow rounded-full mix-blend-soft-light filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Library Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md px-5 py-2 rounded-full border-2 border-white shadow-sm mb-4">
            <HiSparkles className="text-kidPink text-lg" />
            <span className="text-sm font-black text-[#5253A3] uppercase tracking-wider">
              {generatedStories.length} {generatedStories.length === 1 ? "Book" : "Books"} in Collection
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[#5253A3] flex items-center justify-center gap-3 drop-shadow-sm">
            <span>Magical Story Library</span>
            <HiBookOpen className="text-kidPink text-4xl md:text-5xl inline animate-bounce" />
          </h1>
          <p className="text-lg md:text-xl text-[#5253A3]/85 font-bold max-w-2xl mx-auto mt-2">
            Read online with 3D flipbook animation, listen with interactive audiobooks, or print coloring pages!
          </p>
        </div>

        {/* Search, Filter, and Action Bar */}
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] border-4 border-white shadow-xl mb-12 flex flex-col gap-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by story, child, or idea..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-full outline-none border-2 border-transparent focus:border-kidBlue font-bold text-[#5253A3] shadow-sm text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={handleLoadDemoStories}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-gray-50 text-[#5253A3] font-black text-xs shadow-sm border border-white transition flex items-center gap-1.5"
              >
                <FaMagic className="text-kidPink" />
                <span>Load Sample Books</span>
              </button>

              <NavLink to="/create">
                <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-kidYellow to-amber-400 text-[#5253A3] font-black text-xs shadow-md border-2 border-white hover:scale-105 transition flex items-center gap-1.5">
                  <HiSparkles />
                  <span>Create Tale</span>
                </button>
              </NavLink>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#5253A3]/10">
            {categories.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-xs font-black transition-all shadow-sm border flex items-center gap-1.5 ${
                    selectedCategory === cat.value
                      ? "bg-[#5253A3] text-white border-[#5253A3] scale-105"
                      : "bg-white/80 text-[#5253A3] border-white hover:bg-white"
                  }`}
                >
                  <CatIcon
                    className={
                      selectedCategory === cat.value
                        ? "text-kidYellow text-sm"
                        : "text-kidPink text-sm"
                    }
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bookshelf Grid */}
        {sortedStories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedStories.map((story, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -10 }}
                className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border-4 border-white shadow-xl hover:shadow-2xl transition-all duration-300 p-5 flex flex-col justify-between overflow-hidden group relative"
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteStory(story);
                  }}
                  className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-100 flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 active:scale-95"
                  title="Delete Book"
                  aria-label="Delete Book"
                >
                  <FaTrash size={13} />
                </button>

                {/* Book Cover Thumbnail with 3D Spine Illusion */}
                <div
                  onClick={() => setActiveReadingStory(story)}
                  className="cursor-pointer relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-md border-l-8 border-[#a04865] mb-4 group-hover:scale-[1.02] transition-transform duration-300 bg-gray-100"
                >
                  <ImageWithSkeleton
                    src={story.imageUrl || story.coverImage || defaultCoverFallback}
                    fallbackSrc={defaultCoverFallback}
                    alt={story.title}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle Spine Shade */}
                  <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent pointer-events-none"></div>

                  {/* Hover Read Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-black text-sm">
                    <HiBookOpen className="text-2xl text-yellow-300" />
                    <span>Open Reader</span>
                  </div>
                </div>

                {/* Metadata & Starring Child */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {story.childName && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-kidPink bg-pink-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-1.5 border border-pink-200">
                        <FaStar className="text-amber-400 text-xs" />
                        <span>Starring: {story.childName}</span>
                      </span>
                    )}
                    <h3
                      onClick={() => setActiveReadingStory(story)}
                      className="text-xl font-black text-[#5253A3] line-clamp-2 leading-tight cursor-pointer hover:text-kidPink transition mb-2"
                    >
                      {story.title}
                    </h3>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full capitalize inline-flex items-center gap-1 border border-indigo-100">
                      <HiBookOpen className="text-xs text-indigo-600" />
                      <span>{story.storyType}</span>
                    </span>
                    {story.storyTone && (
                      <span className="text-[10px] font-bold bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full capitalize inline-flex items-center gap-1 border border-pink-100">
                        <FaTheaterMasks className="text-xs text-pink-600" />
                        <span>{story.storyTone}</span>
                      </span>
                    )}
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-amber-200">
                      <FaGlobe className="text-xs text-amber-600" />
                      <span>{story.language || "English"}</span>
                    </span>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => setActiveReadingStory(story)}
                      className="w-full py-2.5 bg-gradient-to-r from-[#5253A3] to-[#43448f] hover:from-[#43448f] hover:to-[#38397a] text-white rounded-full font-black text-xs shadow-md transition flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                    >
                      <HiBookOpen className="text-base text-yellow-300" />
                      <span>Read Flipbook</span>
                      <HiSparkles className="text-xs text-pink-300" />
                    </button>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => handlePlayAudiobook(story)}
                        className="py-1.5 rounded-xl bg-amber-100/70 hover:bg-kidYellow text-[#5253A3] font-bold text-[11px] transition flex items-center justify-center gap-1 border border-amber-200/50"
                        title="Listen to Audiobook"
                      >
                        <FaHeadphones size={12} className="text-[#5253A3]" />
                        <span>Listen</span>
                      </button>

                      <button
                        onClick={(e) => handleDownloadColoringBook(e, story)}
                        className="py-1.5 rounded-xl bg-pink-50 hover:bg-kidPink hover:text-white text-kidPink font-bold text-[11px] transition flex items-center justify-center gap-1 border border-pink-200/50 group"
                        title="Print Coloring Book"
                      >
                        <FaPalette size={11} />
                        <span>Color</span>
                      </button>

                      <button
                        onClick={(e) => handleShareMagicLink(e, story)}
                        className="py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] transition flex items-center justify-center border border-gray-200/50"
                        title="Share Story Link"
                      >
                        <FaShareAlt size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-12 bg-white/70 backdrop-blur-xl p-12 md:p-16 rounded-[3rem] border-4 border-white shadow-2xl max-w-xl mx-auto flex flex-col items-center"
          >
            <HiBookOpen className="text-6xl text-[#5253A3] mb-4 animate-bounce" />
            <h2 className="text-3xl font-black text-[#5253A3] mb-2">
              No matching stories found!
            </h2>
            <p className="text-gray-600 font-bold mb-6">
              Try adjusting your search filters, or load sample demo stories to explore right now!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLoadDemoStories}
                className="px-6 py-3.5 bg-kidYellow text-[#5253A3] font-black rounded-full shadow-lg border-2 border-white hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <FaMagic />
                <span>Load Sample Books</span>
              </button>
              <NavLink to="/create">
                <button className="px-6 py-3.5 bg-[#5253A3] text-white font-black rounded-full shadow-lg border-2 border-white hover:bg-[#43448f] transition flex items-center justify-center gap-2">
                  <HiSparkles />
                  <span>Create a Story</span>
                </button>
              </NavLink>
            </div>
          </motion.div>
        )}
      </div>

      {/* Full-Screen Flipbook Reader Modal */}
      {activeReadingStory && (
        <FlipbookReaderModal
          story={activeReadingStory}
          onClose={() => setActiveReadingStory(null)}
          onDownloadPDF={handleDownloadPDF}
          onDownloadColoringBook={handleDownloadColoringBook}
          onShare={handleShareMagicLink}
          onPlayAudiobook={handlePlayAudiobook}
          unlockAchievement={unlockAchievement}
        />
      )}

      {/* Floating Kid-Friendly Audiobook Player Bar */}
      {audioState.isPlaying && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-6 inset-x-4 max-w-2xl mx-auto z-40 bg-[#5253A3] text-white rounded-full p-3 px-6 shadow-2xl border-4 border-white flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-kidYellow shrink-0 shadow-inner">
              <FaHeadphones className="text-xl" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-black truncate">{audioState.storyTitle}</h4>
              <div className="text-[11px] text-yellow-300 font-bold flex items-center gap-2">
                <span>Reading Page {audioState.currentPage} of {audioState.totalPages}</span>
                <span className="flex items-center gap-0.5 ml-1">
                  <span className="w-1 h-3 bg-kidYellow rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1 h-4 bg-kidYellow rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1 h-2 bg-kidYellow rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {audioState.isPaused ? (
              <button
                onClick={resumeAudiobook}
                className="w-10 h-10 rounded-full bg-kidYellow text-[#5253A3] flex items-center justify-center font-black shadow-lg hover:scale-110 active:scale-95 transition"
                title="Resume"
              >
                <FaPlay size={14} className="ml-0.5 text-[#5253A3]" />
              </button>
            ) : (
              <button
                onClick={pauseAudiobook}
                className="w-10 h-10 rounded-full bg-white text-[#5253A3] flex items-center justify-center font-black shadow-lg hover:scale-110 active:scale-95 transition"
                title="Pause"
              >
                <FaPause size={14} className="text-[#5253A3]" />
              </button>
            )}

            <button
              onClick={stopAudiobook}
              className="w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center font-black shadow-lg hover:scale-110 active:scale-95 transition"
              title="Stop"
            >
              <FaStop size={13} className="text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default GeneratedBooks;
