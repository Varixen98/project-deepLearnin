"use client";

// components
import Navbar from "./components/navbar";
import Dock from "./components/dock";
import Orb from "./components/orb";

// icons
import { VscGithubInverted } from "react-icons/vsc";
import { SiYoutube } from "react-icons/si";


export default function Home() {

  const items = [
    { icon: <VscGithubInverted size={18} />, label: 'GitHub', onClick: () => window.open("https://github.com/Varixen98/project-deepLearnin/tree/main ", "_blank") },
    { icon: <SiYoutube size={18} />, label: 'Youtube', onClick: () => window.open("https://www.youtube.com/", "_blank") },
  ];


  return (
    <div className="relative flex flex-col min-w-screen min-h-screen items-center gap-10 bg-black">
      
      <Navbar/>

      {/* Background Container */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Orb
          hoverIntensity={2.0}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>

      {/* hero section */}
      <div id="hero-container" className="flex flex-col w-[85%] h-fit items-center gap-5 z-10 mt-20">
        <div className="flex flex-col items-center gap-5 p-5 text-white">

          <h1 className="text-6xl font-bold font-archivo">Brain Tumor Detection</h1>

          <div className="flex flex-col items-start">
            <p className="font-archivo text-[16px] font-light">
              Using YOLO11s from Ultralytics with modifications:
            </p>
            <ul className="flex flex-col items-start list-disc font-archivo font-light">
              <li>Dengan Bi-directional Feature Pyramid Network (BiFPN).</li>
              <li>Spatial Pyramid Pooling Fast (SPPF).</li>
              <li>And Convolutional Block Attention Module (CBAM).</li>
            </ul>
          </div>
          
          <div className="w-[400px] flex items-center gap-5 font-bold font-archivo">
            <a href="/predict" className="w-[70%] flex items-center justify-center p-2 bg-white text-black rounded-3xl hover:bg-white/50">Get Started</a>
            <a href="/docs" className="w-[70%] flex items-center justify-center p-2 bg-white/10 text-white rounded-3xl hover:bg-white/50">Learn More</a>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 text-white">
        <Dock
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
    </div>
  );
}
