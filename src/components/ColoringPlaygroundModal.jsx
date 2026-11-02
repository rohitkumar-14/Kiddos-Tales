import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaintBrush,
  FaFillDrip,
  FaEraser,
  FaUndo,
  FaRedo,
  FaTrash,
  FaDownload,
  FaPrint,
  FaStar,
  FaHeart,
  FaCrown,
  FaPaw,
  FaSmile,
  FaPalette,
} from "react-icons/fa";
import { HiSparkles, HiX, HiBookOpen, HiArrowLeft, HiArrowRight } from "react-icons/hi";
import confetti from "canvas-confetti";
import useSound from "use-sound";
import toast from "react-hot-toast";
import { getLineArtForStory } from "../data/coloringScenes";

// Helper function to paginate text into story scenes
function paginateText(text, wordLimit = 25) {
  if (!text) return ["Once upon a time in a magical land..."];
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

  return pages.length > 0 ? pages : [text];
}

// 14 Kid-friendly cheerful vibrant colors
const COLOR_PALETTE = [
  { name: "Sunshine Yellow", hex: "#FFD13B" },
  { name: "Tangerine Orange", hex: "#FF8B3D" },
  { name: "Strawberry Red", hex: "#FF4757" },
  { name: "Bubblegum Pink", hex: "#FF6B8B" },
  { name: "Fairy Lilac", hex: "#BD7AFF" },
  { name: "Royal Purple", hex: "#5253A3" },
  { name: "Sky Blue", hex: "#1E90FF" },
  { name: "Ocean Cyan", hex: "#00D2D3" },
  { name: "Minty Green", hex: "#2ED573" },
  { name: "Lime Green", hex: "#7BED9F" },
  { name: "Warm Brown", hex: "#A0522D" },
  { name: "Cozy Chocolate", hex: "#6D4C41" },
  { name: "Midnight Charcoal", hex: "#2F3542" },
  { name: "Snow White (Eraser)", hex: "#FFFFFF" },
];

const BRUSH_SIZES = [
  { label: "Fine", size: 6, dotSize: "w-2 h-2" },
  { label: "Medium", size: 14, dotSize: "w-3.5 h-3.5" },
  { label: "Chunky", size: 26, dotSize: "w-5 h-5" },
  { label: "Giant", size: 44, dotSize: "w-7 h-7" },
];

const STAMPS = [
  { id: "star", label: "Star", symbol: "⭐" },
  { id: "heart", label: "Heart", symbol: "💖" },
  { id: "sparkle", label: "Sparkle", symbol: "✨" },
  { id: "crown", label: "Crown", symbol: "👑" },
  { id: "paw", label: "Paw", symbol: "🐾" },
  { id: "flower", label: "Flower", symbol: "🌸" },
  { id: "butterfly", label: "Butterfly", symbol: "🦋" },
  { id: "rainbow", label: "Rainbow", symbol: "🌈" },
];

export default function ColoringPlaygroundModal({
  story,
  onClose,
  unlockAchievement,
}) {
  const [playPop] = useSound("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3", { volume: 0.4 });
  const [playMagic] = useSound("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3", { volume: 0.5 });

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const rainbowHueRef = useRef(0);

  const pages = paginateText(story?.text);
  const [activePageIndex, setActivePageIndex] = useState(0);

  // Tools state
  const [activeTool, setActiveTool] = useState("brush"); // 'brush' | 'rainbow' | 'bucket' | 'eraser' | 'sticker'
  const [selectedColor, setSelectedColor] = useState("#FF4757");
  const [brushSize, setBrushSize] = useState(14);
  const [selectedSticker, setSelectedSticker] = useState("star");

  // History stack for undo / redo per page
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Store drawings across pages: { [pageIndex]: dataURL }
  const pageDrawingsRef = useRef({});

  // Current line art source
  const currentLineArtUrl = getLineArtForStory(story, activePageIndex);
  const lineArtMaskRef = useRef(null);

  // Pre-rasterize line art into an offscreen binary mask (1 = outline border, 0 = fillable region)
  const buildLineArtMask = useCallback((url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const offCanvas = document.createElement("canvas");
          offCanvas.width = 700;
          offCanvas.height = 700;
          const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
          offCtx.fillStyle = "#FFFFFF";
          offCtx.fillRect(0, 0, 700, 700);
          offCtx.drawImage(img, 0, 0, 700, 700);

          const imgData = offCtx.getImageData(0, 0, 700, 700);
          const data = imgData.data;
          const mask = new Uint8Array(700 * 700);

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            // Black strokes (#000000) have low luminance; antialiased edge pixels are < 135
            const lum = r * 0.299 + g * 0.587 + b * 0.114;
            if (a > 50 && lum < 135) {
              mask[i >> 2] = 1; // Solid barrier line
            }
          }
          lineArtMaskRef.current = mask;
          resolve(mask);
        } catch (err) {
          console.error("Mask build error:", err);
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }, []);

  useEffect(() => {
    buildLineArtMask(currentLineArtUrl);
  }, [currentLineArtUrl, buildLineArtMask]);

  // Initialize Canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    
    // Set internal resolution
    canvas.width = 700;
    canvas.height = 700;

    // Check if we have saved drawing for this page
    const savedDataUrl = pageDrawingsRef.current[activePageIndex];
    if (savedDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        saveHistorySnapshot();
      };
      img.src = savedDataUrl;
    } else {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHistory([canvas.toDataURL()]);
      setHistoryStep(0);
    }
  }, [activePageIndex]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Save current snapshot into history stack
  const saveHistorySnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    pageDrawingsRef.current[activePageIndex] = dataUrl;

    setHistory((prev) => {
      const sliced = prev.slice(0, historyStep + 1);
      const next = [...sliced, dataUrl];
      if (next.length > 20) next.shift();
      return next;
    });
    setHistoryStep((prev) => Math.min(prev + 1, 19));
  };

  // Switch between pages while persisting art
  const handlePageChange = (newIndex) => {
    if (newIndex === activePageIndex) return;
    const canvas = canvasRef.current;
    if (canvas) {
      pageDrawingsRef.current[activePageIndex] = canvas.toDataURL();
    }
    setActivePageIndex(newIndex);
    setHistory([]);
    setHistoryStep(-1);
    playPop();
  };

  // Undo
  const handleUndo = () => {
    if (historyStep <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const newStep = historyStep - 1;
    const targetDataUrl = history[newStep];
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistoryStep(newStep);
      pageDrawingsRef.current[activePageIndex] = targetDataUrl;
    };
    img.src = targetDataUrl;
    playPop();
  };

  // Redo
  const handleRedo = () => {
    if (historyStep >= history.length - 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const newStep = historyStep + 1;
    const targetDataUrl = history[newStep];
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistoryStep(newStep);
      pageDrawingsRef.current[activePageIndex] = targetDataUrl;
    };
    img.src = targetDataUrl;
    playPop();
  };

  // Clear Canvas
  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistorySnapshot();
    toast("Canvas cleaned! Ready for fresh magic ✨", { icon: "🧹" });
    playPop();
  };

  // Get pointer coordinates relative to canvas
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Flood Fill / Paint Bucket Algorithm (Strictly bounded by vector line-art outlines)
  const handleFloodFill = (startX, startY, fillHex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const width = canvas.width;
    const height = canvas.height;

    // Ensure line-art boundary mask exists
    let mask = lineArtMaskRef.current;
    if (!mask) {
      try {
        const offCanvas = document.createElement("canvas");
        offCanvas.width = width;
        offCanvas.height = height;
        const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
        offCtx.fillStyle = "#FFFFFF";
        offCtx.fillRect(0, 0, width, height);
        const tempImg = new Image();
        tempImg.src = currentLineArtUrl;
        offCtx.drawImage(tempImg, 0, 0, width, height);
        const imgD = offCtx.getImageData(0, 0, width, height);
        const d = imgD.data;
        mask = new Uint8Array(width * height);
        for (let i = 0; i < d.length; i += 4) {
          const lum = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
          if (d[i + 3] > 50 && lum < 135) {
            mask[i >> 2] = 1;
          }
        }
        lineArtMaskRef.current = mask;
      } catch (err) {
        console.error("Failed to build fallback line-art mask:", err);
      }
    }

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Parse target fill color from hex
    const fillR = parseInt(fillHex.slice(1, 3), 16);
    const fillG = parseInt(fillHex.slice(3, 5), 16);
    const fillB = parseInt(fillHex.slice(5, 7), 16);

    let intX = Math.round(startX);
    let intY = Math.round(startY);
    if (intX < 0 || intX >= width || intY < 0 || intY >= height) return;

    // If child clicked directly on an outline line, find the nearest open pixel in a 5px radius
    let pIdx = intY * width + intX;
    if (mask && mask[pIdx] === 1) {
      let found = false;
      for (let radius = 1; radius <= 5 && !found; radius++) {
        const offsets = [
          [radius, 0], [-radius, 0], [0, radius], [0, -radius],
          [radius, radius], [-radius, -radius], [radius, -radius], [-radius, radius]
        ];
        for (const [dx, dy] of offsets) {
          const nx = intX + dx;
          const ny = intY + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIdx = ny * width + nx;
            if (!mask[nIdx]) {
              intX = nx;
              intY = ny;
              pIdx = nIdx;
              found = true;
              break;
            }
          }
        }
      }
      if (!found) return; // Inside a thick border
    }

    const startPixel = pIdx * 4;
    const targetR = data[startPixel];
    const targetG = data[startPixel + 1];
    const targetB = data[startPixel + 2];

    // Already the exact same color?
    if (
      Math.abs(targetR - fillR) < 12 &&
      Math.abs(targetG - fillG) < 12 &&
      Math.abs(targetB - fillB) < 12
    ) {
      return;
    }

    const tolerance = 42;
    // Check if pixel (x, y) can be filled: matches target color AND is not a line boundary
    const canFill = (x, y) => {
      const idx = y * width + x;
      if (mask && mask[idx] === 1) return false;
      const dIdx = idx * 4;
      return (
        Math.abs(data[dIdx] - targetR) <= tolerance &&
        Math.abs(data[dIdx + 1] - targetG) <= tolerance &&
        Math.abs(data[dIdx + 2] - targetB) <= tolerance
      );
    };

    // Fast Span-based Scanline Flood Fill
    const pixelStack = [[intX, intY]];
    const filled = new Uint8Array(width * height);

    while (pixelStack.length > 0) {
      const [curX, curY] = pixelStack.pop();
      let x1 = curX;

      // Scan left to find start of fillable horizontal span
      while (x1 >= 0 && canFill(x1, curY) && !filled[curY * width + x1]) {
        x1--;
      }
      x1++;

      // Scan right to find end of fillable horizontal span
      let x2 = curX;
      while (x2 < width && canFill(x2, curY) && !filled[curY * width + x2]) {
        x2++;
      }
      x2--;

      // Fill pixels along the span
      for (let x = x1; x <= x2; x++) {
        const idx = curY * width + x;
        filled[idx] = 1;
        const dIdx = idx * 4;
        data[dIdx] = fillR;
        data[dIdx + 1] = fillG;
        data[dIdx + 2] = fillB;
        data[dIdx + 3] = 255;
      }

      // Check rows directly above and below to seed contiguous spans
      const checkRow = (nextY) => {
        if (nextY < 0 || nextY >= height) return;
        let spanAdded = false;
        for (let x = x1; x <= x2; x++) {
          const idx = nextY * width + x;
          if (!filled[idx] && canFill(x, nextY)) {
            if (!spanAdded) {
              pixelStack.push([x, nextY]);
              spanAdded = true;
            }
          } else {
            spanAdded = false;
          }
        }
      };

      checkRow(curY - 1);
      checkRow(curY + 1);
    }

    ctx.putImageData(imgData, 0, 0);
    saveHistorySnapshot();
    playPop();
  };

  // Stamp Sticker on Canvas
  const handleStampSticker = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const stampObj = STAMPS.find((s) => s.id === selectedSticker) || STAMPS[0];

    ctx.save();
    ctx.font = `${brushSize * 2.5 + 24}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(stampObj.symbol, x, y);
    ctx.restore();

    saveHistorySnapshot();
    playPop();
  };

  // Pointer Down (Mouse / Touch / Stylus)
  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    const coords = getCanvasCoords(e);
    lastPosRef.current = coords;

    if (activeTool === "bucket") {
      handleFloodFill(coords.x, coords.y, selectedColor);
      return;
    }

    if (activeTool === "sticker") {
      handleStampSticker(coords.x, coords.y);
      return;
    }

    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle =
      activeTool === "eraser"
        ? "#FFFFFF"
        : activeTool === "rainbow"
        ? `hsl(${rainbowHueRef.current}, 95%, 55%)`
        : selectedColor;
    ctx.fill();
  };

  // Pointer Move
  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;

    if (activeTool === "eraser") {
      ctx.strokeStyle = "#FFFFFF";
    } else if (activeTool === "rainbow") {
      rainbowHueRef.current = (rainbowHueRef.current + 8) % 360;
      ctx.strokeStyle = `hsl(${rainbowHueRef.current}, 95%, 55%)`;
    } else {
      ctx.strokeStyle = selectedColor;
    }

    ctx.stroke();
    lastPosRef.current = coords;
  };

  // Pointer Up
  const handlePointerUp = (e) => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      saveHistorySnapshot();
    }
  };

  // Save Colored Artwork as High-Res PNG
  const handleSaveMasterpiece = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    playMagic();
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 900;
    exportCanvas.height = 1000;
    const expCtx = exportCanvas.getContext("2d");

    // White Card Background
    expCtx.fillStyle = "#FFF8FB";
    expCtx.fillRect(0, 0, 900, 1000);

    // Top Header Banner
    expCtx.fillStyle = "#5253A3";
    expCtx.fillRect(0, 0, 900, 90);
    expCtx.fillStyle = "#FFD700";
    expCtx.font = "bold 32px 'Fredoka', sans-serif";
    expCtx.textAlign = "center";
    expCtx.fillText(story?.title || "My Coloring Tale", 450, 45);
    expCtx.font = "bold 20px 'Fredoka', sans-serif";
    expCtx.fillStyle = "#FFFFFF";
    expCtx.fillText(
      story?.childName
        ? `Illustrated by: ${story.childName} ⭐ • Page ${activePageIndex + 1}`
        : `Page ${activePageIndex + 1} • Kiddos Tales Artwork`,
      450,
      75
    );

    // Draw the kid's colored canvas in the center
    expCtx.drawImage(canvas, 100, 120, 700, 700);

    // Overlay line art on top with multiply blend
    const overlayImg = new Image();
    overlayImg.crossOrigin = "anonymous";
    overlayImg.onload = () => {
      expCtx.globalCompositeOperation = "multiply";
      expCtx.drawImage(overlayImg, 100, 120, 700, 700);
      expCtx.globalCompositeOperation = "source-over";

      // Border frame around art
      expCtx.lineWidth = 10;
      expCtx.strokeStyle = "#5253A3";
      expCtx.strokeRect(95, 115, 710, 710);

      // Bottom caption from story
      expCtx.fillStyle = "#333333";
      expCtx.font = "bold 20px 'Fredoka', sans-serif";
      expCtx.textAlign = "center";
      const captionText = pages[activePageIndex] || story?.subject || "";
      const truncated =
        captionText.length > 70
          ? captionText.substring(0, 70) + "..."
          : captionText;
      expCtx.fillText(`"${truncated}"`, 450, 875);

      // Watermark footer
      expCtx.fillStyle = "#FF4E98";
      expCtx.font = "bold 16px 'Fredoka', sans-serif";
      expCtx.fillText("Created with Kiddos Tales ✨ Color Your Own Adventure", 450, 930);

      // Trigger download
      const link = document.createElement("a");
      link.download = `${story?.title || "Story"}_Coloring_Page_${activePageIndex + 1}.png`;
      link.href = exportCanvas.toDataURL("image/png");
      link.click();

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      toast.success("✨ Your colored masterpiece has been downloaded!", {
        icon: "🎨",
        style: { borderRadius: "20px", background: "#5253A3", color: "#fff" },
      });

      if (unlockAchievement) {
        unlockAchievement("coloring_artist", "Coloring Artist", "🎨");
      }
    };
    overlayImg.src = currentLineArtUrl;
  };

  // Print Physical Multi-Page Coloring Book (PDF / Sketch Book)
  const handlePrintColoringBook = () => {
    playMagic();
    let printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${story?.title || "Coloring Book"} - Printable Sketch Book</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            body {
              font-family: 'Fredoka', sans-serif;
              color: #000;
              background: #fff;
              margin: 0;
              padding: 0;
              text-align: center;
            }
            .page {
              page-break-after: always;
              height: 98vh;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              box-sizing: border-box;
              padding: 20px 10px;
            }
            .cover-page {
              border: 8px dashed #000;
              border-radius: 30px;
              padding: 40px 20px;
              background: #fff;
            }
            .title {
              font-size: 42px;
              font-weight: 700;
              margin: 10px 0;
              text-transform: capitalize;
            }
            .subtitle {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 25px;
            }
            .color-box {
              width: 90%;
              max-width: 520px;
              aspect-ratio: 1 / 1;
              border: 5px solid #000;
              border-radius: 20px;
              object-fit: contain;
              margin: 10px auto;
            }
            .caption {
              font-size: 20px;
              line-height: 1.6;
              font-weight: 600;
              max-width: 85%;
              margin: 15px auto;
              border-top: 2px solid #ccc;
              padding-top: 10px;
            }
            .palette-tester {
              display: flex;
              justify-content: center;
              gap: 15px;
              margin-top: 25px;
            }
            .swatch-circle {
              width: 45px;
              height: 45px;
              border: 3px solid #000;
              border-radius: 50%;
            }
            .footer {
              font-size: 14px;
              font-weight: bold;
              color: #444;
            }
            @media screen {
              body { background: #f0f3ff; padding: 20px; }
              .page { background: #fff; max-width: 800px; margin: 20px auto; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius: 24px; height: auto; min-height: 900px; padding: 40px; }
            }
          </style>
        </head>
        <body>
          <!-- Cover Page -->
          <div class="page cover-page">
            <div>
              <p style="font-size: 18px; letter-spacing: 2px; text-transform: uppercase; font-weight: bold;">🖍️ Printable Sketch & Coloring Book</p>
              <h1 class="title">${story?.title || "My Magical Tale"}</h1>
              ${story?.childName ? `<h2 class="subtitle">Starring: ${story.childName}</h2>` : ""}
            </div>
            
            <img class="color-box" src="${treehouseLineArt}" alt="Coloring Cover" />

            <div>
              <p style="font-size: 18px; font-weight: bold;">Test Your Crayons Below! 🎨</p>
              <div class="palette-tester">
                <div class="swatch-circle"></div>
                <div class="swatch-circle"></div>
                <div class="swatch-circle"></div>
                <div class="swatch-circle"></div>
                <div class="swatch-circle"></div>
                <div class="swatch-circle"></div>
              </div>
            </div>

            <div class="footer">Kiddos Tales • Free Kids Printable Activity Book</div>
          </div>
    `;

    pages.forEach((pageText, idx) => {
      const lineArt = getLineArtForStory(story, idx);
      printHtml += `
        <div class="page">
          <div style="font-size: 16px; font-weight: bold; text-transform: uppercase;">
            ${story?.title || "Story"} — Page ${idx + 1}
          </div>

          <img class="color-box" src="${lineArt}" alt="Page ${idx + 1} Illustration" />

          <div class="caption">
            ${pageText}
          </div>

          <div class="footer">Page ${idx + 1} of ${pages.length} • Color Your Own World with Kiddos Tales</div>
        </div>
      `;
    });

    // Certificate Page
    printHtml += `
          <div class="page cover-page" style="border: 8px double #000;">
            <h1 class="title" style="margin-top: 40px;">🌟 Master Artist Certificate 🌟</h1>
            <p style="font-size: 22px; font-weight: bold; margin: 20px 0;">This certifies that</p>
            <h2 style="font-size: 38px; text-decoration: underline; margin: 10px 0;">${story?.childName || "A Brilliant Kiddo"}</h2>
            <p style="font-size: 22px; font-weight: bold; margin: 20px 0;">has enthusiastically colored and completed the story of</p>
            <h3 style="font-size: 28px; font-style: italic; margin-bottom: 40px;">"${story?.title || "An Amazing Adventure"}"</h3>

            <div style="display: flex; justify-content: space-around; width: 90%; margin-top: 50px;">
              <div>
                <div style="border-top: 2px solid #000; width: 180px; margin-top: 40px;"></div>
                <p style="font-weight: bold;">Artist Signature</p>
              </div>
              <div>
                <div style="border-top: 2px solid #000; width: 180px; margin-top: 40px;"></div>
                <p style="font-weight: bold;">Date Completed</p>
              </div>
            </div>

            <div class="footer">Kiddos Tales Young Artists Club 🎨</div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 600);
            };
          </script>
        </body>
      </html>
    `;

    const printWin = window.open("", "_blank");
    if (printWin) {
      printWin.document.write(printHtml);
      printWin.document.close();
      toast.success("🖍️ Opening Print Preview! Select 'Save as PDF' or Print.", {
        icon: "🖨️",
        style: { borderRadius: "20px", background: "#5253A3", color: "#fff" },
      });
    } else {
      toast.error("Please allow popups to open the coloring book print window!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-6xl bg-gradient-to-br from-indigo-50 via-pink-50 to-amber-50 rounded-[2.5rem] border-4 border-white shadow-2xl flex flex-col overflow-hidden max-h-[96vh]"
      >
        {/* Studio Top Navigation Bar */}
        <div className="bg-[#5253A3] text-white px-6 py-3.5 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-kidYellow flex items-center justify-center text-[#5253A3] font-black shadow">
              <FaPalette size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black line-clamp-1">
                {story?.title || "Coloring Studio"}
              </h2>
              <p className="text-[11px] text-yellow-200 font-bold hidden sm:block">
                Fill with color, stamp magic stickers, or print a real sketch book!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintColoringBook}
              className="px-3.5 py-1.5 rounded-full bg-white text-[#5253A3] hover:bg-yellow-100 font-black text-xs shadow-md transition flex items-center gap-1.5"
              title="Print Physical Coloring Book PDF"
            >
              <FaPrint size={13} className="text-[#5253A3]" />
              <span className="hidden sm:inline">Print Sketch Book</span>
            </button>

            <button
              onClick={handleSaveMasterpiece}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-kidYellow to-amber-400 text-[#5253A3] font-black text-xs shadow-md hover:scale-105 active:scale-95 transition flex items-center gap-1.5"
              title="Save Artwork as Image"
            >
              <FaDownload size={13} />
              <span>Save Art</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition ml-1"
              title="Close Studio"
            >
              <HiX size={20} />
            </button>
          </div>
        </div>

        {/* Scene / Page Navigation Strip */}
        <div className="bg-white/70 backdrop-blur-md px-6 py-2.5 border-b border-indigo-100 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-[#5253A3] tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <HiBookOpen className="text-sm text-kidPink" />
              <span>Scenes:</span>
            </span>
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx)}
                className={`px-3.5 py-1 rounded-full text-xs font-black transition shadow-sm border shrink-0 ${
                  activePageIndex === idx
                    ? "bg-[#5253A3] text-white border-[#5253A3] scale-105"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-yellow-50"
                }`}
              >
                Page {idx + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleUndo}
              disabled={historyStep <= 0}
              className={`p-2 rounded-full transition shadow-sm border ${
                historyStep > 0
                  ? "bg-white text-[#5253A3] border-gray-200 hover:bg-indigo-50"
                  : "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
              }`}
              title="Undo"
            >
              <FaUndo size={12} />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyStep >= history.length - 1}
              className={`p-2 rounded-full transition shadow-sm border ${
                historyStep < history.length - 1
                  ? "bg-white text-[#5253A3] border-gray-200 hover:bg-indigo-50"
                  : "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
              }`}
              title="Redo"
            >
              <FaRedo size={12} />
            </button>
            <button
              onClick={handleClearCanvas}
              className="p-2 rounded-full bg-white hover:bg-rose-50 text-rose-500 border border-rose-200 transition shadow-sm"
              title="Clear Page"
            >
              <FaTrash size={12} />
            </button>
          </div>
        </div>

        {/* Main Canvas + Tools Workspace */}
        <div className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center overflow-y-auto">
          {/* Left Canvas Column (7 Cols on LG) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            {/* Story Text Hint for Current Scene */}
            <div className="w-full max-w-[540px] bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border-2 border-white shadow-sm mb-3 text-center">
              <p className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2">
                "{pages[activePageIndex]}"
              </p>
            </div>

            {/* Interactive Layered Coloring Canvas Viewport */}
            <div
              ref={containerRef}
              className="relative w-full max-w-[540px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-white select-none cursor-crosshair touch-none group"
            >
              {/* Bottom Layer: Drawing Canvas where child paints */}
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="w-full h-full block"
              />

              {/* Top Layer: Clean Black Line Art Outlines with Multiply Blend */}
              <img
                src={currentLineArtUrl}
                alt="Story Outlines"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none mix-blend-multiply select-none"
                draggable={false}
              />

              {/* Subtle Paper Texture Overlay */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-15 pointer-events-none"></div>
            </div>

            <p className="text-[11px] font-bold text-gray-500 mt-2 flex items-center gap-1.5">
              <HiSparkles className="text-kidPink text-xs" />
              <span>Outlines stay on top like magic! Color freely with crayons or fill bucket.</span>
            </p>
          </div>

          {/* Right Tools & Palette Column (5 Cols on LG) */}
          <div className="lg:col-span-5 flex flex-col gap-4 bg-white/70 backdrop-blur-md p-5 rounded-[2rem] border-3 border-white shadow-lg">
            {/* 1. Main Tools Selector */}
            <div>
              <span className="text-[11px] font-black uppercase text-[#5253A3] tracking-wider block mb-2">
                1. Choose Magic Tool:
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {/* Crayon */}
                <button
                  onClick={() => {
                    setActiveTool("brush");
                    playPop();
                  }}
                  className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 font-black text-[10px] transition shadow-sm border ${
                    activeTool === "brush"
                      ? "bg-[#5253A3] text-white border-[#5253A3] scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-yellow-50"
                  }`}
                >
                  <FaPaintBrush size={14} className={activeTool === "brush" ? "text-kidYellow" : "text-kidPink"} />
                  <span>Crayon</span>
                </button>

                {/* Magic Rainbow */}
                <button
                  onClick={() => {
                    setActiveTool("rainbow");
                    playPop();
                  }}
                  className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 font-black text-[10px] transition shadow-sm border ${
                    activeTool === "rainbow"
                      ? "bg-gradient-to-r from-pink-500 via-yellow-400 to-indigo-500 text-white border-white scale-105 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-yellow-50"
                  }`}
                >
                  <HiSparkles size={14} className="text-yellow-300 animate-spin" style={{ animationDuration: "3s" }} />
                  <span>Rainbow</span>
                </button>

                {/* Paint Bucket */}
                <button
                  onClick={() => {
                    setActiveTool("bucket");
                    playPop();
                  }}
                  className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 font-black text-[10px] transition shadow-sm border ${
                    activeTool === "bucket"
                      ? "bg-[#5253A3] text-white border-[#5253A3] scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-yellow-50"
                  }`}
                >
                  <FaFillDrip size={14} className={activeTool === "bucket" ? "text-kidYellow" : "text-cyan-500"} />
                  <span>Bucket</span>
                </button>

                {/* Eraser */}
                <button
                  onClick={() => {
                    setActiveTool("eraser");
                    playPop();
                  }}
                  className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 font-black text-[10px] transition shadow-sm border ${
                    activeTool === "eraser"
                      ? "bg-[#5253A3] text-white border-[#5253A3] scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-yellow-50"
                  }`}
                >
                  <FaEraser size={14} className={activeTool === "eraser" ? "text-kidYellow" : "text-gray-500"} />
                  <span>Eraser</span>
                </button>

                {/* Stamps */}
                <button
                  onClick={() => {
                    setActiveTool("sticker");
                    playPop();
                  }}
                  className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 font-black text-[10px] transition shadow-sm border ${
                    activeTool === "sticker"
                      ? "bg-[#5253A3] text-white border-[#5253A3] scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-yellow-50"
                  }`}
                >
                  <FaStar size={14} className={activeTool === "sticker" ? "text-kidYellow" : "text-amber-400"} />
                  <span>Sticker</span>
                </button>
              </div>
            </div>

            {/* Sticker Stamp Picker (Visible when tool is 'sticker') */}
            {activeTool === "sticker" && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50/80 p-2.5 rounded-2xl border-2 border-amber-200"
              >
                <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider block mb-1.5">
                  Pick Stamp Symbol:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {STAMPS.map((stamp) => (
                    <button
                      key={stamp.id}
                      onClick={() => {
                        setSelectedSticker(stamp.id);
                        playPop();
                      }}
                      className={`text-lg p-1.5 rounded-xl transition ${
                        selectedSticker === stamp.id
                          ? "bg-amber-300 scale-110 shadow"
                          : "bg-white hover:bg-amber-100"
                      }`}
                      title={stamp.label}
                    >
                      {stamp.symbol}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 2. Brush Size Selector */}
            <div>
              <span className="text-[11px] font-black uppercase text-[#5253A3] tracking-wider block mb-2">
                2. Size:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {BRUSH_SIZES.map((b) => (
                  <button
                    key={b.size}
                    onClick={() => {
                      setBrushSize(b.size);
                      playPop();
                    }}
                    className={`py-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition border ${
                      brushSize === b.size
                        ? "bg-[#5253A3] text-white border-[#5253A3] shadow-md"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`${b.dotSize} rounded-full ${
                        brushSize === b.size ? "bg-kidYellow" : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-[10px] font-black">{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Color Palette Swatches */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase text-[#5253A3] tracking-wider">
                  3. Color Palette:
                </span>
                <label
                  className="flex items-center gap-1.5 text-[11px] font-black text-kidPink cursor-pointer hover:underline"
                  title="Choose any custom color"
                >
                  <FaPalette size={11} />
                  <span>Custom Color</span>
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => {
                      setSelectedColor(e.target.value);
                      if (activeTool === "eraser") setActiveTool("brush");
                    }}
                    className="w-5 h-5 rounded-full border border-gray-300 cursor-pointer p-0 opacity-0 absolute pointer-events-none"
                  />
                </label>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      setSelectedColor(c.hex);
                      if (activeTool === "eraser") setActiveTool("brush");
                      playPop();
                    }}
                    style={{ backgroundColor: c.hex }}
                    className={`aspect-square rounded-full transition-all duration-200 border-2 shadow-sm ${
                      selectedColor === c.hex && activeTool !== "eraser"
                        ? "scale-115 ring-4 ring-[#5253A3] ring-offset-2 border-white"
                        : "border-black/10 hover:scale-105"
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions Footer inside tool panel */}
            <div className="pt-2 border-t border-indigo-100 flex items-center justify-between gap-2">
              <button
                onClick={handlePrintColoringBook}
                className="flex-1 py-2 px-3 rounded-full bg-white hover:bg-gray-50 text-[#5253A3] border border-gray-200 font-black text-xs shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <FaPrint size={12} />
                <span>Print Sketch Book</span>
              </button>

              <button
                onClick={handleSaveMasterpiece}
                className="flex-1 py-2 px-3 rounded-full bg-[#5253A3] hover:bg-[#43448f] text-white font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 hover:scale-102"
              >
                <FaDownload size={12} />
                <span>Save Artwork</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
