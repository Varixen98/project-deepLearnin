"use client";
import { useState, useRef } from "react";
import Navbar from "../components/navbar";
import Orb from "../components/orb";

// --- TYPES ---
interface Detection {
  bbox: [number, number, number, number]; // [x1, y1, x2, y2]
  class: string;
  confidence: number;
}

interface PredictionResult {
  diagnosis: string;
  confidence: number;
  all_detections: Detection[];
  error?: string;
}

interface ImageItem {
  file: File;
  id: string;
  preview: string;
  width: number;
  height: number;
  result: PredictionResult | null;
}

// --- ICONS ---
const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

export default function Predict() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newImages: ImageItem[] = files.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      width: 0,
      height: 0,
      result: null,
    }));

    setImages(newImages);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageLoad = (id: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, width: naturalWidth, height: naturalHeight } : img
      )
    );
  };

  const predictAll = async () => {
    setLoading(true);
    const updatedImages = await Promise.all(
      images.map(async (img) => {
        if (img.result) return img;
        const formData = new FormData();
        formData.append("file", img.file);

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"; // Fallback to local
          const res = await fetch(`${apiUrl}/predict`, { 
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          return { ...img, result: data };
        } catch (error) {
          console.error("Prediction failed:", error);
          return { 
            ...img, 
            result: { error: "Failed", diagnosis: "Error", confidence: 0, all_detections: [] } 
          };
        }
      })
    );
    setImages(updatedImages);
    setLoading(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-y-auto font-archivo">
      <Navbar />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <Orb hoverIntensity={2.0} rotateOnHover={true} hue={0} forceHoverState={false} />
      </div>

      <div className="z-10 flex flex-col items-center w-full px-5 py-10 gap-8 min-h-screen">
        <div className="text-center space-y-2 mt-10">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-linear-to-br from-blue-400 to-indigo-600 tracking-tight">
            AI Diagnosis
          </h1>
          <p className="text-gray-400 text-lg">Upload MRI scans for instant tumor classification.</p>
        </div>

        <div className="flex gap-4 w-full max-w-4xl justify-center">
          <button
            // FIX: Added '?.' to safely access current
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 backdrop-blur-md flex items-center gap-2 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">+</span> Upload MRI
          </button>
          <input
            type="file"
            multiple
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
          />
          
          {images.length > 0 && (
            <button
              onClick={predictAll}
              disabled={loading}
              className="px-8 py-4 bg-white text-black hover:bg-white/50 hover:text-white rounded-2xl font-bold shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Run Analysis"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl pb-20">
          {images.map((img) => {
            // FIX: Safely access result properties with ?.
            const isHealthy = img.result?.diagnosis === "No Tumor";
            const isError = img.result?.error;
            const hasResult = img.result && !isError;

            // Safe diagnosis string processing
            const diagnosisText = img.result?.diagnosis 
              ? img.result.diagnosis.charAt(0).toUpperCase() + img.result.diagnosis.slice(1)
              : "";

            return (
              <div
                key={img.id}
                className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-transform hover:scale-[1.01] duration-300"
              >
                {/* 1. TOP SECTION: IMAGE + BOUNDING BOXES */}
                <div className="relative w-full aspect-square bg-black flex items-center justify-center">
                  <img
                    src={img.preview}
                    alt="MRI Scan"
                    className="w-full h-full object-contain"
                    onLoad={(e) => handleImageLoad(img.id, e)}
                  />

                  {/* Bounding Boxes (Red) - Only shown for Tumors */}
                  {/* FIX: Check for result existence before mapping */}
                  {hasResult && !isHealthy && img.result?.all_detections?.map((det, i) => {
                    const [x1, y1, x2, y2] = det.bbox;
                    const left = (x1 / img.width) * 100;
                    const top = (y1 / img.height) * 100;
                    const width = ((x2 - x1) / img.width) * 100;
                    const height = ((y2 - y1) / img.height) * 100;

                    return (
                      <div
                        key={i}
                        style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
                        className="absolute border-2 border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.5)] rounded-sm"
                      />
                    );
                  })}
                </div>

                {/* 2. BOTTOM SECTION: RESULT CARD */}
                {hasResult ? (
                  <div className={`
                    p-6 flex items-center justify-between border-t transition-colors duration-300
                    ${isHealthy 
                      ? "bg-linear-to-r from-emerald-950 to-emerald-900 border-emerald-500/30" 
                      : "bg-linear-to-r from-red-950 to-red-900 border-red-500/30"
                    }
                  `}>
                    {/* Text Info */}
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-bold tracking-widest uppercase mb-1 
                        ${isHealthy ? "text-emerald-300" : "text-red-300"}`}>
                        DIAGNOSIS
                      </span>
                      
                      <span className="text-2xl font-bold text-white tracking-tight">
                        {isHealthy ? "Healthy" : diagnosisText}
                      </span>

                      {/* FIXED: Always show a subtitle line so height matches */}
                      <span className={`text-xs mt-1 opacity-80 font-medium ${isHealthy ? "text-emerald-200" : "text-red-200"}`}>
                        {isHealthy 
                          ? "No abnormalities detected" 
                          : `Confidence: ${Math.round((img.result?.confidence || 0) * 100)}%`
                        }
                      </span>
                    </div>

                    {/* Icon Bubble */}
                    <div className={`
                      p-3 rounded-full shadow-lg
                      ${isHealthy ? "bg-emerald-600 shadow-emerald-900/50" : "bg-red-600 shadow-red-900/50"}
                    `}>
                      {isHealthy ? <CheckIcon /> : <WarningIcon />}
                    </div>
                  </div>
                ) : (
                  // Default Footer before prediction
                  <div className="p-4 bg-neutral-900 border-t border-neutral-800">
                    <p className="text-sm text-gray-500 text-center">Ready to analyze</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}