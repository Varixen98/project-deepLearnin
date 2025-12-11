"use client";
import Orb from "../components/orb";
import Navbar from "../components/navbar";

export default function Docs(){
    return(
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
                <div className="flex flex-col items-center gap-10 p-5 text-white">
                
                    <h1 className="text-6xl font-bold font-archivo">About Us</h1>

                    <div className="grid grid-cols-3 gap-5">
                        <div className="text-white font-archivo bg-white/10 backdrop-blur-md p-4 rounded-2xl">
                            <h2 className="text-2xl">Wisnutomo Adji Nugroho</h2>
                            <p className="font-light">NIM: 2702380216</p>
                        </div>
                        <div className="text-white font-archivo bg-white/10 backdrop-blur-md p-4 rounded-2xl">
                            <h2 className="text-2xl">Muhammad Samy Syafta</h2>
                            <p className="font-light">NIM: 2702348902</p>
                        </div>
                        <div className="text-white font-archivo bg-white/10 backdrop-blur-md p-4 rounded-2xl">
                            <h2 className="text-2xl">Ikhsan Maulana Putra</h2>
                            <p className="font-light">NIM: 2702373425</p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}