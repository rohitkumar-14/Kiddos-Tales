import React, { useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { motion } from "framer-motion";
import { FaTrash, FaVolumeUp, FaStop, FaFilePdf } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import confetti from "canvas-confetti";
import useSound from "use-sound";
import toast from "react-hot-toast";

// Helper function to split text into pages
function paginateText(text, wordLimit = 25) {
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

// Component to stagger image loading and provide skeleton shimmer during network fetch
function StaggeredImage({ src, alt, index, className }) {
  const [loadSrc, setLoadSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    // Reset state when src changes
    setLoadSrc(null);
    setIsLoaded(false);
    setError(false);

    // If it's the cover (index 0), load immediately
    if (index === 0) {
      setLoadSrc(src);
      return;
    }

    // Stagger image requests to avoid overwhelming the browser/API
    const timer = setTimeout(() => {
      setLoadSrc(src);
    }, index * 600);

    return () => clearTimeout(timer);
  }, [src, index]);

  return (
    <div className={className + " relative bg-white/50 flex items-center justify-center overflow-hidden transition-all duration-700 group"}>
      {/* Shimmer Skeleton Overlay while waiting for timer or fetching image */}
      {!error && (!loadSrc || !isLoaded) && (
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 animate-shimmer flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center opacity-60 animate-pulse">
            <span className="text-3xl mb-1">🪄</span>
            <span className="text-xs font-bold text-[#5253A3] italic">Sketching magic...</span>
          </div>
        </div>
      )}

      {error ? (
        <div className="flex flex-col items-center justify-center text-gray-400 p-4 text-center z-10">
          <span className="text-4xl mb-2">🎨</span>
          <p className="text-xs font-bold uppercase text-[#5253A3]">Drawing in progress...</p>
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
              e.target.classList.remove('grayscale');
              e.target.style.filter = 'none';
            }}
            onError={() => {
              setError(true);
              setIsLoaded(true);
            }}
          />
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-30 pointer-events-none"></div>
        </div>
      ) : null}
    </div>
  );
}

function BookItem({ story, index, onDelete, unlockAchievement }) {
  const bookRef = React.useRef();
  const [isBilingual, setIsBilingual] = useState(false);
  const [playPageTurn] = useSound('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', { volume: 0.3 });
  const [playPop] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.6 });

  const handleFlip = (e) => {
    playPageTurn();
    const totalPages = paginateText(story.text).length + 1;
    if (e.data >= totalPages) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF9EBB', '#FFF6A3', '#83E4F6']
      });
      playPop();
    }
  };

  const closeBook = (e) => {
    e.stopPropagation();
    if (bookRef.current) {
      bookRef.current.pageFlip().turnToPage(0);
    }
  };

  const readAloud = (text, e) => {
    e.stopPropagation();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const stopReading = (e) => {
    e.stopPropagation();
    window.speechSynthesis.cancel();
  };

  const playAudiobook = (e, storyText) => {
    e.stopPropagation();
    window.speechSynthesis.cancel();
    const pages = paginateText(storyText, 25);
    let currentPage = 0;
    
    const readNextPage = () => {
      if (currentPage >= pages.length) return;
      
      if (bookRef.current) {
        bookRef.current.pageFlip().turnToPage(currentPage + 1);
      }
      
      const utterance = new SpeechSynthesisUtterance(pages[currentPage]);
      utterance.rate = 0.9; // Read slightly slower for kids
      
      utterance.onend = () => {
        currentPage++;
        // Add a small delay between pages
        setTimeout(readNextPage, 1000);
      };
      
      window.speechSynthesis.speak(utterance);
    };
    
    readNextPage();
  };

  const downloadColoringBook = async (e, story) => {
    e.stopPropagation();
    const loadingToast = toast.loading("🎨 Fetching your coloring pages...", {
      style: {
        borderRadius: '20px',
        background: '#5253A3',
        color: '#fff',
      },
    });
    
    const pages = paginateText(story.text, 25);
    
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
    
    // Function to convert image to base64 so it works perfectly in the new window
    const getBase64Image = async (url) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.error("Error fetching image for PDF", e);
        return url; // Fallback to URL
      }
    };

    for (let i = 0; i < pages.length; i++) {
      const pageImagePrompt = `highly detailed coloring page for kids, thick black outlines, simple white background, no grey, no shading, clean line art. Scene: ${story.subject}, ${pages[i].substring(0, 50)}.`;
      const pageImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(pageImagePrompt)}?width=800&height=1000&nologo=true&seed=${i + 42}`;
      
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
                // Short delay to ensure browser paints the images
                setTimeout(() => {
                  window.print();
                }, 800);
              }
            }
            // Fallback in case onload events fail
            setTimeout(() => {
              if(loadedCount < totalImages) window.print();
            }, 5000);
          </script>
        </body>
      </html>
    `;

    toast.dismiss(loadingToast);
    toast.success("🖍️ Opening Print View! Set destination to 'Save as PDF' if you want a file.", {
      duration: 5000,
      style: {
        borderRadius: '20px',
        background: '#FF9EBB',
        color: '#fff',
      },
    });

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printHtml);
      printWindow.document.close();
    } else {
      toast.error("Please allow popups to print your coloring book!");
    }
  };

  const downloadPDF = async (e, story) => {
    e.stopPropagation();
    const loadingToast = toast.loading("🪄 Formatting your magical PDF...", {
      style: { borderRadius: '20px', background: '#5253A3', color: '#fff' },
    });

    const pages = paginateText(story.text, 25);
    const element = document.createElement("div");
    element.style.width = "800px";
    
    let htmlContent = `
      <div style="font-family: 'Fredoka', sans-serif; color: #333; background: #fff;">
        <div style="padding: 60px; text-align: center; background: #CAD3FF; color: #5253A3; border-bottom: 10px solid #fff;">
          <h1 style="font-size: 48px; margin-bottom: 10px;">${story.title}</h1>
          ${story.childName ? `<h2 style="font-size: 24px; color: #FF4E98;">Starring: ${story.childName}</h2>` : ""}
          <img src="${story.imageUrl}" style="width: 300px; height: 300px; object-fit: cover; border-radius: 30px; border: 8px solid white; margin-top: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
        </div>
    `;

    for (let i = 0; i < pages.length; i++) {
      const pageImagePrompt = `Children's book illustration for: ${story.subject}, ${pages[i].substring(0, 50)}. ${story.storyTheme} theme, colorful, professional illustration`;
      const pageImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(pageImagePrompt)}?width=800&height=500&nologo=true&seed=${i + 50}`;
      
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
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().from(element).set(opt).save();
      toast.dismiss(loadingToast);
      toast.success("✨ Your book is ready!", {
        style: { borderRadius: '20px', background: '#FF9EBB', color: '#fff' },
      });
    } catch (err) {
      console.error(err);
      toast.dismiss(loadingToast);
      toast.error("Failed to generate PDF. Try again!");
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this story?")) {
      onDelete(index);
    }
  };

  const shareMagicLink = (e, story) => {
    e.stopPropagation();
    const shareData = {
      t: story.title,
      s: story.subject,
      tx: story.text,
      et: story.englishText,
      i: story.imageUrl,
      l: story.language
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const url = `${window.location.origin}/?magic=${encoded}`;
    
    navigator.clipboard.writeText(url).then(() => {
      toast.success("✨ Magic Link copied to clipboard! Share it with your friends.", {
        icon: '🔗',
        style: { borderRadius: '20px', background: '#5253A3', color: '#fff' }
      });
      unlockAchievement("sharer", "Social Star", "🌟");
    });
  };

  return (
         <motion.div 
           initial={{ opacity: 0, scale: 0.8 }} 
           animate={{ opacity: 1, scale: 1 }} 
           transition={{ delay: index * 0.2 }}
           whileHover={{ y: -15, scale: 1.02 }}
           className="relative z-10 hover:z-50"
         >
          <HTMLFlipBook
          ref={bookRef}
          width={450}
          height={550}
          showCover={true}
          onFlip={handleFlip}
          className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-r-2xl overflow-hidden cursor-pointer"
        >
          {/* Book Cover */}
          <div className="relative h-full overflow-hidden flex flex-col rounded-r-2xl border-l-[16px] border-[#c05f7d] shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <StaggeredImage 
                src={story.imageUrl} 
                alt={story.title} 
                index={0}
                className="w-full h-full object-cover" 
              />
              {/* Subtle Overlay to make text pop */}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <button onClick={handleDelete} className="absolute top-4 right-4 text-white bg-red-500/80 p-3 rounded-full hover:bg-red-600 hover:scale-110 transition z-20 shadow-lg">
              <FaTrash size={18} />
            </button>

            <div className="relative z-10 w-full h-full flex flex-col justify-between items-center p-8 text-center">
              <div className="w-full mt-4">
                <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-xl inline-block w-full">
                  <h1 className="text-3xl font-black mb-2 drop-shadow-md text-[#5253A3] leading-tight">{story.title || "KiddoTales Book"}</h1>
                  {story.childName && <p className="text-lg font-bold text-kidPink drop-shadow-sm mb-0">Starring: {story.childName}</p>}
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/50 w-full shadow-2xl flex flex-col gap-3">
                <button onClick={(e) => playAudiobook(e, isBilingual ? story.englishText : story.text)} className="w-full bg-kidYellow text-[#5253A3] py-2 rounded-full font-bold shadow-md hover:scale-105 transition flex items-center justify-center gap-2">
                  <FaVolumeUp /> Play Audiobook 🎧
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsBilingual(!isBilingual); }}
                  className={`w-full py-2 rounded-full font-bold shadow-md hover:scale-105 transition border-2 ${isBilingual ? 'bg-kidBlue text-white border-white' : 'bg-white text-kidBlue border-kidBlue'}`}
                >
                  {isBilingual ? "✨ Bilingual Mode ON" : "🌍 Bilingual Mode OFF"}
                </button>
                <div className="mt-2 flex flex-col gap-1 font-medium text-sm">
                  <p className="capitalize">Type: {story.storyType}</p>
                  <p>Language: {story.language || 'English'}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 px-6 py-3 bg-[#c05f7d] text-white rounded-full shadow-lg animate-bounce border-2 border-white/50 w-full flex items-center justify-center">
              <p className="text-lg font-bold">Open to Read 📖</p>
            </div>
            {/* Fairy Dust Overlay when hovered */}
            <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition pointer-events-none rounded-r-2xl"></div>
          </div>

          {/* Book Pages */}
          {paginateText(story.text).map((pageContent, pageIndex) => {
            const geminiPrompt = story.pageImagePrompts && story.pageImagePrompts[pageIndex];
            const pageImagePrompt = geminiPrompt || `Children's book illustration for: ${story.subject}, ${pageContent.substring(0, 50)}. ${story.storyTheme} theme, colorful`;
            const pageImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(pageImagePrompt)}?width=800&height=800&nologo=true&seed=${pageIndex + 100}&model=flux`;

            return (
            <div key={pageIndex} className="relative h-full overflow-hidden flex flex-col shadow-[inset_0_0_10px_rgba(0,0,0,0.1)] border-l border-gray-300">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <StaggeredImage 
                  src={pageImageUrl} 
                  alt={story.subject} 
                  index={pageIndex}
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 flex flex-col h-full p-8">
                <h2 className="text-2xl font-extrabold capitalize text-[#5253A3] mb-4 drop-shadow-sm">{story.title || "Story Time"}</h2>
                
                <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-lg">
                  <p className={`text-[18px] leading-[2rem] text-gray-900 font-bold ${isBilingual ? 'mb-4 border-b pb-4 border-gray-300' : ''}`}>
                    {pageContent}
                  </p>
                  {isBilingual && story.englishText && (
                    <p className="text-[16px] leading-[1.8rem] text-gray-600 italic font-bold">
                      {paginateText(story.englishText)[pageIndex] || "Translating magic..."}
                    </p>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200/50 flex justify-between items-center text-[#5253A3] font-black uppercase tracking-widest text-sm">
                  <div className="flex gap-4">
                    <button onClick={(e) => readAloud(pageContent, e)} className="bg-white/80 p-2 rounded-full hover:scale-125 transition shadow-sm border border-white" title="Read Aloud"><FaVolumeUp size={18} /></button>
                    <button onClick={stopReading} className="bg-white/80 p-2 rounded-full hover:scale-125 transition shadow-sm border border-white" title="Stop Reading"><FaStop size={18} /></button>
                  </div>
                  <span className="bg-white/80 px-4 py-1 rounded-full shadow-sm border border-white">Page {pageIndex + 1}</span>
                </div>
              </div>
            </div>
            );
          })}
          
          {/* Back Cover */}
          <div className="flex flex-col justify-center items-center bg-kidBlue text-white h-full p-8 text-center rounded-l-2xl border-r-[16px] border-[#4aacc2] shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] overflow-y-auto">
            <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">The End</h2>
            
            {story.quiz && story.quiz.length > 0 && (
              <div className="bg-white/20 p-4 rounded-xl mb-4 w-full text-left shadow-inner border border-white/30">
                <h3 className="text-xl font-extrabold text-kidYellow mb-2 drop-shadow-sm">Quiz Time! 🧠</h3>
                <p className="font-semibold mb-3 text-sm">{story.quiz[0]?.question}</p>
                <div className="flex flex-col gap-2">
                  {story.quiz[0]?.options.map((opt, i) => (
                    <button key={i} onClick={(e) => { 
                      e.stopPropagation(); 
                      if (opt === story.quiz[0].answer) {
                        toast.success('Correct! 🎉 You are so smart!', { icon: '🌟' });
                      } else {
                        toast.error('Oops, try again!', { icon: '🤔' });
                      }
                    }} className="bg-white text-kidBlue px-3 py-2 rounded-xl text-sm font-bold hover:bg-kidYellow transition shadow-sm text-left">
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 w-full px-2">
              <button onClick={(e) => downloadPDF(e, story)} className="w-full flex items-center justify-center gap-2 bg-kidYellow text-[#5253A3] px-4 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition">
                <FaFilePdf size={16} /> Save as PDF
              </button>
              <button onClick={(e) => downloadColoringBook(e, story)} className="w-full flex items-center justify-center gap-2 bg-white text-kidPink px-4 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition border-4 border-kidPink">
                <FaFilePdf size={16} /> Print Coloring Book 🖍️
              </button>
              <button onClick={(e) => shareMagicLink(e, story)} className="w-full flex items-center justify-center gap-2 bg-kidPink text-white px-4 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition">
                <FaVolumeUp size={16} /> Share Magic Link ✨
              </button>
              <button onClick={closeBook} className="w-full mt-2 px-4 py-2 bg-white/20 text-white rounded-full font-bold shadow-sm hover:bg-white/30 transition border border-white/50">
                Close Book
              </button>
            </div>
          </div>
        </HTMLFlipBook>
        </motion.div>
  );
}

function GeneratedBooks({ generatedStories, updateGeneratedStories, unlockAchievement }) {

  const handleDeleteStory = (index) => {
    const updated = [...generatedStories];
    updated.splice(index, 1);
    updateGeneratedStories(updated);
  };

  const getThemeBg = () => {
    if (!generatedStories.length) return "bg-[#1F2937]";
    const tone = generatedStories[generatedStories.length - 1]?.storyTone; // Use latest story tone
    if (tone === "funny") return "bg-[#fef08a]";
    if (tone === "scary") return "bg-[#111827]";
    if (tone === "bedtime") return "bg-[#0f172a]";
    if (tone === "adventure") return "bg-[#e0f2fe]";
    return "bg-[#1F2937]"; // default
  };

  return (
    <div className={`flex flex-wrap justify-center items-center gap-16 min-h-screen ${getThemeBg()} transition-colors duration-1000 p-8 pb-20 relative overflow-hidden`}>
      {/* Decorative background circles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-kidPink rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-kidYellow rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-32 h-32 bg-kidBlue rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>

      {generatedStories.length > 0 ? (
        generatedStories.map((story, index) => (
          <BookItem key={index} story={story} index={index} onDelete={handleDeleteStory} unlockAchievement={unlockAchievement} />
        ))
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-20 bg-white/10 p-12 rounded-3xl backdrop-blur-md border border-white/20">
          <h2 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">No stories yet! 🥲</h2>
          <p className="text-2xl text-kidYellow font-medium">Head over to 'Create Story' to craft some magic.</p>
        </motion.div>
      )}
    </div>
  );
}

export default GeneratedBooks;
